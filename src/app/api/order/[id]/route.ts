import Order from "@/database/order.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, context: contextProps) {
  const params = await context.params;

  try {
    await connectToDatabase();

    const session = (await getServerSession(authOptions)) as Session | null;
    const sessionEmail = session?.user?.email;
    const isAdmin = (session?.user as { role?: string })?.role === "admin";

    const order = await Order.findOne({ orderNum: params.id });

    if (order) {
      if (!isAdmin && order.email !== sessionEmail) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }
      return NextResponse.json(order);
    }

    const orderById = await Order.findOne({ _id: params.id });

    if (orderById) {
      if (!isAdmin && orderById.email !== sessionEmail) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }
      return NextResponse.json(orderById);
    }

    const user = await User.findById(params.id);
    if (user) {
      if (!isAdmin && user.email !== sessionEmail) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }
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
