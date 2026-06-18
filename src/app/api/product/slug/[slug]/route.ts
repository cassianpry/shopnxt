import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";
import type { RouteParams } from "@/lib/api/shared";
import { errorMessage } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"slug">) {
  const params = await context.params;

  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: params.slug });
    return NextResponse.json(product);
  } catch (error) {
    return errorMessage(error);
  }
}
