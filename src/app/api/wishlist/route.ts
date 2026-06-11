import { Product } from "@/database/product.model";
import User from "@/database/user.model";
import WishList from "@/database/wishlist.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    await connectToDatabase();

    const userExists = await User.findById(data.user);

    const productExists = await Product.findById(data.product);

    if (!userExists) {
      return NextResponse.json({ Error: "Usuário não encontrado" });
    }

    if (!productExists) {
      return NextResponse.json({ Error: "Produto não encontrado" });
    }

    const wishList = await WishList.findOne({ user: data.user });

    if (wishList) {
      const isProductInWishlist = wishList.products.some(
        (productId: ObjectId) => (productId as any).equals(data.product)
      );

      if (isProductInWishlist) {
        return NextResponse.json({
          Error: "Produto já existe na lista de desejos",
        });
      }

      wishList.products.push(data.product);
      await wishList.save();
      return NextResponse.json({ wishList });
    } else {
      const newWishList = await WishList.create({
        user: data.user,
        products: [data.product],
      });

      return NextResponse.json({ wishList: newWishList });
    }
  } catch (error) {
    console.log("API Wishlist=>", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
