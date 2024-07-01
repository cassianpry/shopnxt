import Order from "@/database/order.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: contextProps) {
  try {
    await connectToDatabase();

    const order = await Order.findOne({ orderNum: params.id });

    if (order) {
      return NextResponse.json(order);
    }

    const orderById = await Order.findOne({ _id: params.id });

    if (orderById) {
      return NextResponse.json(orderById);
    }

    const user = await User.findById(params.id);
    if (user) {
      const orders = await Order.find({ email: user.email });
      if (orders) {
        return NextResponse.json(orders);
      } else {
        return NextResponse.json(null);
      }
    }
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
