import { NextResponse } from "next/server";
import { connectToDatabase } from "@/src/database/dbConnect";
import slugify from "slugify";
import Category, { ICategory } from "@/src/database/Category.model";

export async function POST(req: { json: () => any }) {
  await connectToDatabase();
  const body = await req.json();
  const { name } = body;

  try {
    const category = await Category.create({ name, slug: slugify(name) });
    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json((err as Error).message, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const category: ICategory[] = (await Category.find({})).sort({
      createdAt: -1,
    } as any);

    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json((err as Error).message, { status: 500 });
  }
}
