import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Order from "@/database/order.model";
import GameKey from "@/database/gamekey.model";
import Library from "@/database/library.model";
import type { OrderItemProps } from "@/types/index.d";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function PATCH(req: NextRequest, context: RouteParams<"id">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    const { status } = await req.json();

    const validStatuses = ["paid", "fulfilled", "cancelled", "refunded"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (status === "fulfilled") {
      const availableKeys = await GameKey.find({
        product: { $in: order.items.map((i: OrderItemProps) => i.product) },
        status: "available",
      });

      if (availableKeys.length < order.items.length) {
        return NextResponse.json(
          { error: "Not enough keys available for fulfillment" },
          { status: 400 }
        );
      }
    }

    order.status = status;
    if (status === "paid") order.paidAt = new Date();
    if (status === "fulfilled") {
      const keysToAssign = await GameKey.find({
        product: { $in: order.items.map((i: OrderItemProps) => i.product) },
        status: "available",
      }).limit(order.items.length);

      const keyIds = keysToAssign.map((k) => k._id);
      await GameKey.updateMany(
        { _id: { $in: keyIds } },
        { $set: { status: "sold", order: order._id, assignedAt: new Date() } }
      );

      if (order.user) {
        await Library.findOneAndUpdate(
          { user: order.user },
          {
            $push: {
              products: {
                $each: order.items.map((item: OrderItemProps, index: number) => ({
                  product: item.product,
                  keys: keysToAssign[index] ? [keysToAssign[index].key] : [],
                  purchasedAt: new Date(),
                  orderNum: order.orderNum,
                })),
              },
            },
          },
          { upsert: true }
        );
      }
    }

    await order.save();
    return NextResponse.json(order);
  } catch (error) {
    return serverError(error);
  }
}
