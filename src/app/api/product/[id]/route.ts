import { Genres } from "@/database/genre.model";
import { Product } from "@/database/product.model";
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
    const product = await Product.findById(params.id);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: contextProps) {
  const params = await context.params;
  const data = await req.json();

  try {
    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(params.id, {
      $set: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description,
        shortDescription: data.shortDescription,
        about: data.about,
        productImage: data.productImage,
        genres: [],
        developer: data.developer,
        publisher: data.publisher,
        system: data.system,
        processor: data.processor,
        memory: data.memory,
        storage: data.storage,
        graphicCard: data.graphicCard,
        price: data.price,
        active: data.active,
      },
    });

    const genreDocuments = [];
    for (const genre of data.genres) {
      const existingGenre = await Genres.findById(genre);

      genreDocuments.push({
        _id: existingGenre!._id,
        name: existingGenre!.name,
      });
    }

    const productWithGenres = await Product.findByIdAndUpdate(product._id, {
      $push: { genres: { $each: genreDocuments } },
    });

    return NextResponse.json("Produto alterado", productWithGenres);
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message);
  }
}
