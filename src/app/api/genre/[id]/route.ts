import Genres from "@/database/genre.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { GenreFormSchema } from "@/lib/actions/validations";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import type { RouteParams } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;
  try {
    await connectToDatabase();

    const category = await Genres.findById(params.id);

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return serverError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;

  try {
    const data = await req.json();

    const parsed = GenreFormSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    await connectToDatabase();
    const genre = await Genres.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name,
          slug: slugify(name),
        },
      },
      { returnDocument: 'after' }
    );
    return NextResponse.json(genre);
  } catch (error) {
    console.log(error);
    return serverError(error);
  }
}
