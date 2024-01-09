import { NextResponse } from "next/server";
import { connectToDatabase } from "@/src/database/dbConnect";
import slugify from "slugify";
import Category from "@/src/database/Category.model";
import { NextApiRequest } from "next";

export async function PUT(
  req: { json: () => any },
  context: { params: { id: any } }
) {
  await connectToDatabase();
  const body = req.json();
  const { name } = body;
  try {
    const updatingCategory = await Category.findByIdAndUpdate(
      context.params.id,
      { ...body, slugify: slugify(name) },
      { new: true }
    );
    return NextResponse.json(updatingCategory);
  } catch (err) {
    return NextResponse.json((err as Error).message, { status: 500 });
  }
}

export async function DELETE(context: { params: { id: any } }) {
  await connectToDatabase();

  try {
    const deletingCategory = await Category.findByIdAndDelete(
      context.params.id
    );
    return NextResponse.json(deletingCategory);
  } catch (err) {
    return NextResponse.json((err as Error).message, { status: 500 });
  }
}
