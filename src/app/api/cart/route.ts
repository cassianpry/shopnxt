import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Cart from "@/database/cart.model";
import { Product } from "@/database/product.model";
import type { SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const cart = await Cart.findOne({ user: sessionUser._id }).populate("items.product");

    return NextResponse.json(cart ?? { items: [] });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: sessionUser._id },
      {
        $push: { items: { product: product._id, price: product.price } },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(cart);
  } catch (error) {
    return serverError(error);
  }
}
