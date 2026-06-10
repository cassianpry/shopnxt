import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: NextRequest, context: contextProps) {
  const params = await context.params;

  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: params.slug });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
