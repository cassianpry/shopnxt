import Order from "@/database/order.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { errorMessage } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;

  try {
    await connectToDatabase();

    const session = (await getServerSession(authOptions)) as Session | null;
    const sessionEmail = session?.user?.email;
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";

    // Search by orderNum or _id
    const order = await Order.findOne({
      $or: [
        { orderNum: params.id },
        { _id: mongoose.isValidObjectId(params.id) ? params.id : new mongoose.Types.ObjectId() }
      ]
    })
      .populate("items.product")
      .populate("user", "name email");

    if (order) {
      if (!isAdmin && order.email !== sessionEmail && String(order.user?._id) !== String(sessionUser?._id)) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }
      return NextResponse.json(order);
    }

    const user = await User.findById(params.id);
    if (user) {
      if (!isAdmin && user.email !== sessionEmail) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }
      const orders = await Order.find({ user: user._id })
        .populate("items.product")
        .populate("user", "name email");
      return NextResponse.json(orders);
    }

    return NextResponse.json(null, { status: 404 });
  } catch (error) {
    return errorMessage(error);
  }
}
