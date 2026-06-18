import Genres from "@/database/genre.model";
import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { ProductFormSchema } from "@/lib/actions/validations";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import type { RouteParams } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;

  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);

    return NextResponse.json(product);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;
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

    const product = await Product.findByIdAndUpdate(params.id, {
      $set: {
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
      },
    });

    const genreDocs = await Genres.find({ _id: { $in: validated.genres } });
    const genreDocuments = genreDocs.map((g) => ({
      _id: g._id,
      name: g.name,
    }));

    await Product.findByIdAndUpdate(product!._id, {
      $push: { genres: { $each: genreDocuments } },
    });

    return NextResponse.json("Produto alterado");
  } catch (error) {
    console.log(error);
    return serverError(error);
  }
}
