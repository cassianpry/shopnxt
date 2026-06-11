import User from "@/database/user.model";
import WishList from "@/database/wishlist.model";
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

  if (params.id === "undefined" || params.id == "") {
    return NextResponse.json("Id Indefinido");
  } else {
    try {
      await connectToDatabase();

      const session = (await getServerSession(authOptions)) as Session | null;
      const sessionUser = session?.user as { _id?: string } | undefined;
      if (!sessionUser || sessionUser._id !== params.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }

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

export async function DELETE(req: NextRequest, context: contextProps) {
  const params = await context.params;
  const data = await req.json();
  if (params.id === "undefined") {
    return NextResponse.json({});
  } else {
    try {
      await connectToDatabase();

      const session = (await getServerSession(authOptions)) as Session | null;
      const sessionUser = session?.user as { _id?: string } | undefined;
      if (!sessionUser || sessionUser._id !== params.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
      }

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
