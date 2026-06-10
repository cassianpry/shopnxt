import { Genres } from "@/database/genre.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

interface contextProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, context: contextProps) {
  const params = await context.params;
  try {
    await connectToDatabase();

    const category = await Genres.findById(params.id);

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: contextProps) {
  const params = await context.params;

  try {
    await connectToDatabase();
    const data = await req.json();
    const genre = await Genres.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: data.name,
          slug: slugify(data.name),
        },
      },
      { returnDocument: 'after' }
    );
    return NextResponse.json(genre);
  } catch (error) {
    return NextResponse.json(
      { message: "Could not update category" },
      { status: 500 }
    );
  }
}
