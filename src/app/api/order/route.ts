import Order from "@/database/order.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { UserOrderSchema } from "@/lib/actions/validations";
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

    if (searchQuery !== "undefined") {
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
    const order = await Order.create(validated);
    return NextResponse.json({ userId, orderId: order.orderNum });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
