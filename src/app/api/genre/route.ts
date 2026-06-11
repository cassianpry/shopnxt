import { connectToDatabase } from "@/lib/actions/mongoose";
import { GenreFormSchema } from "@/lib/actions/validations";
import { NextRequest, NextResponse } from "next/server";
import Genres from "@/database/genre.model";
import slugify from "slugify";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  const searchQuery = new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("searchQuery");

  const pageNumber = +new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("page")!;

  //+new: convert to number and "!"" in the end, show that never be null
  const pageSize = +new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("pageSize")!;

  //Calculate the number of Products to skip based on the page number and page size
  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    await connectToDatabase();
    const query: Record<string, unknown> = {};
    if (searchQuery && searchQuery !== "undefined") {
      query.$or = [
        { name: { $regex: escapeRegex(searchQuery), $options: "i" } },
        { slug: { $regex: escapeRegex(searchQuery), $options: "i" } },
      ];
    }
    const genre = await Genres.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalGenres = await Genres.countDocuments(query);

    const isNext = totalGenres > skipAmount + genre.length;

    return NextResponse.json({ genre, isNext, totalGenres });
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const parsed = GenreFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    await connectToDatabase();
    const existingGenre = await Genres.findOne({ name });

    if (existingGenre) {
      return NextResponse.json(
        { error: "Categoria já cadastrada!" },
        { status: 400 }
      );
    }

    const genre = await Genres.create({
      name,
      slug: slugify(name),
    });
    return NextResponse.json({ success: "Categoria Criada", genre });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
