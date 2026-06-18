import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Review from "@/database/review.model";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function DELETE(req: NextRequest, context: RouteParams<"id">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await context.params;
    await connectToDatabase();

    const review = await Review.findOneAndDelete({
      _id: id,
      user: sessionUser._id,
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return serverError(error);
  }
}
