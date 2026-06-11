import Genres from "@/database/genre.model";
import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  const searchQuery = new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("searchQuery");

  //+new: convert to number and "!"" in the end, show that never be null
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
  const skipAmount = ((pageNumber ? pageNumber : 1) - 1) * pageSize;

  try {
    await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (searchQuery !== "undefined") {
      query.$or = [
        { name: { $regex: searchQuery ? escapeRegex(searchQuery) : "", $options: "i" } },
        {
          developer: { $regex: searchQuery ? escapeRegex(searchQuery) : "", $options: "i" },
        },
        {
          publisher: { $regex: searchQuery ? escapeRegex(searchQuery) : "", $options: "i" },
        },
        {
          description: {
            $regex: searchQuery ? escapeRegex(searchQuery) : "",
            $options: "i",
          },
        },
        {
          "genres.name": {
            $regex: searchQuery ? escapeRegex(searchQuery) : "",
            $options: "i",
          },
        },
      ];
    }
    const products = await Product.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);
    const isNext = totalProducts > skipAmount + products.length;

    if (products.length === 0) {
      return NextResponse.json(null);
    } else {
      return NextResponse.json({ products, isNext, totalProducts });
    }
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

import { ProductFormSchema } from "@/lib/actions/validations";

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const parsed = ProductFormSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const validated = parsed.data;
    delete validated._id;

    await connectToDatabase();

    const existingProduct = await Product.find({
      slug: slugify(validated.name).toLowerCase(),
    });
    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: "Produto já cadastrado!" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: validated.name,
      slug: slugify(validated.name),
      description: validated.description,
      shortDescription: validated.shortDescription,
      about: validated.about,
      productImage: validated.productImage,
      genres: [],
      developer: validated.developer,
      publisher: validated.publisher,
      system: validated.system,
      processor: validated.processor,
      memory: validated.memory,
      storage: validated.storage,
      graphicCard: validated.graphicCard,
      price: validated.price,
      active: validated.active,
    });

    const genreDocuments = [];
    for (const genre of validated.genres) {
      const existingGenre = await Genres.findById(genre);

      genreDocuments.push({
        _id: existingGenre!._id,
        name: existingGenre!.name,
      });
    }

    await Product.findByIdAndUpdate(product._id, {
      $push: { genres: { $each: genreDocuments } },
    });

    return NextResponse.json("Produto criado");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
