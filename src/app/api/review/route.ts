import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Review from "@/database/review.model";
import type { SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { productId, rating, title, body } = await req.json();
    if (!productId || !rating) {
      return NextResponse.json({ error: "productId and rating required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    await connectToDatabase();

    const review = await Review.findOneAndUpdate(
      { user: sessionUser._id, product: productId },
      { rating, title, body },
      { upsert: true, new: true }
    );

    return NextResponse.json(review);
  } catch (error) {
    return serverError(error);
  }
}
