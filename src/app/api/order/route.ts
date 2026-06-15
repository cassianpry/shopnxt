import Order from "@/database/order.model";
import Coupon from "@/database/coupon.model";
import Cart from "@/database/cart.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { UserOrderSchema } from "@/lib/actions/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  const searchQuery = new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("searchQuery");

  //+new: convert to number and "!"" in the end, show that never be null
  const pageNumber = +new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("page")!;

  //+new: convert to number and "!"" in the end, show that never be null
  const pageSize = +new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("pageSize")!;

  //Calculate the number of Products to skip based on the page number and page size
  const skipAmount = ((pageNumber ? pageNumber : 1) - 1) * pageSize;

  try {
    await connectToDatabase();

    const query: Record<string, unknown> = {};

    if (searchQuery && searchQuery !== "undefined") {
      query.$or = [
        { orderNum: { $regex: searchQuery ? escapeRegex(searchQuery) : "", $options: "i" } },
        {
          name: {
            $regex: searchQuery ? escapeRegex(searchQuery) : "",
            $options: "i",
          },
          email: {
            $regex: searchQuery ? escapeRegex(searchQuery) : "",
            $options: "i",
          },
        },
      ];
    }

    const orders = await Order.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    //Aggregates Total value of all orders
    const totalAggregate = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalGeral: {
            $sum: "$totalPrice",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalGeral: 1,
        },
      },
    ]);

    //Extract total from Array
    const total = totalAggregate.length > 0 ? totalAggregate[0].totalGeral : 0;

    const totalOrders = await Order.countDocuments(query);
    const isNext = totalOrders > skipAmount + orders.length;
    if (orders.length > 0) {
      return NextResponse.json({ orders, totalOrders, isNext, total });
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const parsed = UserOrderSchema.safeParse(data.values);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const validated = parsed.data;
    const userId = validated._id;
    delete validated._id;
    delete (validated as any).cardNumber;
    delete (validated as any).expireDate;
    delete (validated as any).cvv;
    delete (validated as any).checkAddress;

    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { _id?: string; email?: string } | null;

    let discountAmount = 0;
    let appliedCoupon = null;

    if (data.couponCode) {
      const coupon = await Coupon.findOne({ code: data.couponCode, active: true });
      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
      }

      const now = new Date();
      if (coupon.validFrom && now < coupon.validFrom) {
        return NextResponse.json({ error: "Coupon not yet valid" }, { status: 400 });
      }
      if (coupon.validUntil && now > coupon.validUntil) {
        return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
      }
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      if (data.totalPrice < coupon.minPurchase) {
        return NextResponse.json({ error: "Minimum purchase not met" }, { status: 400 });
      }

      discountAmount =
        coupon.discountType === "percentage"
          ? (data.totalPrice * coupon.discountValue) / 100
          : Math.min(coupon.discountValue, data.totalPrice);

      appliedCoupon = coupon._id;
    }

    // Map frontend cartProducts (ProductProps[]) to schema items array
    const items = data.cartProducts?.map((item: any) => ({
      product: item._id,
      name: item.name,
      price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
      quantity: 1,
    })) ?? [];

    const order = await Order.create({
      ...validated,
      user: sessionUser?._id || null,
      items,
      totalPrice: (data.totalPrice ?? 0) - discountAmount,
      coupon: appliedCoupon,
      discountAmount,
      status: "pending",
    });

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon, { $inc: { usedCount: 1 } });
    }

    if (items.length > 0 && sessionUser?._id) {
      await Cart.findOneAndUpdate(
        { user: sessionUser._id },
        { $set: { items: [] } }
      );
    }

    return NextResponse.json({ userId, orderId: order.orderNum, orderStatus: order.status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
