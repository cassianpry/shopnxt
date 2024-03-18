import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: contextProps) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: params.slug });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
