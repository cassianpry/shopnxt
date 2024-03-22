import User from "@/database/user.model";
import WishList from "@/database/wishlist.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: contextProps) {
  if (params.id === "undefined" || params.id == "") {
    return NextResponse.json("Id Indefinido");
  } else {
    try {
      await connectToDatabase();

      const userExists = await User.findById(params.id);

      if (!userExists || params.id === "undefined") {
        return NextResponse.json({ Error: "Usuário não cadastrado" });
      }

      const wishlist = await WishList.findOne({
        user: userExists._id,
      }).populate("products");

      if (!wishlist) {
        return NextResponse.json({ wishlist });
      }
      return NextResponse.json({ wishlist });
    } catch (error) {
      console.log("Wishlist GET==>", error);
      return NextResponse.json((error as Error).message, { status: 500 });
    }
  }
}

export async function DELETE(req: NextRequest, { params }: contextProps) {
  const data = await req.json();
  if (params.id === "undefined") {
    return NextResponse.json({});
  } else {
    try {
      await connectToDatabase();

      const wishListProductDelete = await WishList.updateOne(
        { user: params.id },
        { $pull: { products: data.product } }
      );
      return NextResponse.json({ wishListProductDelete });
    } catch (error) {
      console.log(error);
      return NextResponse.json((error as Error).message, { status: 500 });
    }
  }
}
