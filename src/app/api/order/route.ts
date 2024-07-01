import Order from "@/database/order.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

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

    const query: FilterQuery<typeof Order> = {};

    if (searchQuery !== "undefined") {
      query.$or = [
        { orderNum: { $regex: searchQuery ? searchQuery : "", $options: "i" } },
        {
          name: {
            $regex: searchQuery ? searchQuery : "",
            $options: "i",
          },
          email: {
            $regex: searchQuery ? searchQuery : "",
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
  const userId = data.values._id;
  delete data.values._id;
  try {
    await connectToDatabase();
    const order = await Order.create(data.values);
    return NextResponse.json({ userId, orderId: order.orderNum });
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
