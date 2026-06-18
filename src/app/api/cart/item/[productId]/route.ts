import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Cart from "@/database/cart.model";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function PATCH(req: NextRequest, context: RouteParams<"productId">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { productId } = await context.params;
    await connectToDatabase();

    const cart = await Cart.findOneAndUpdate(
      { user: sessionUser._id, "items.product": productId },
      { $set: { "items.$.price": (await req.json()).price } },
      { new: true }
    );

    if (!cart) {
      return NextResponse.json({ error: "Cart or item not found" }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(req: NextRequest, context: RouteParams<"productId">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { productId } = await context.params;
    await connectToDatabase();

    const cart = await Cart.findOneAndUpdate(
      { user: sessionUser._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return serverError(error);
  }
}
