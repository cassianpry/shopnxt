import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Review from "@/database/review.model";
import mongoose from "mongoose";

interface ContextProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: ContextProps) {
  try {
    const { id } = await context.params;

    const pageNumber = Math.max(1, +new URL(req.url, `${process.env.BASE_URL}`).searchParams.get("page")! || 1);
    const pageSize = Math.max(1, +new URL(req.url, `${process.env.BASE_URL}`).searchParams.get("pageSize")! || 10);
    const skipAmount = (pageNumber - 1) * pageSize;

    await connectToDatabase();

    const [reviews, totalReviews, stats] = await Promise.all([
      Review.find({ product: id })
        .populate("user", "name avatar")
        .skip(skipAmount)
        .limit(pageSize)
        .sort({ createdAt: -1 }),
      Review.countDocuments({ product: id }),
      Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: null, averageRating: { $avg: "$rating" }, total: { $sum: 1 } } },
      ]),
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const isNext = totalReviews > skipAmount + reviews.length;

    return NextResponse.json({ reviews, averageRating, totalReviews, isNext });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
