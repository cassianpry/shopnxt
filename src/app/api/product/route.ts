import { Genres } from "@/database/genre.model";
import { Product } from "@/database/product.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

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
    const query: FilterQuery<typeof Product> = {};

    if (searchQuery !== "undefined") {
      query.$or = [
        { name: { $regex: searchQuery ? searchQuery : "", $options: "i" } },
        {
          developer: { $regex: searchQuery ? searchQuery : "", $options: "i" },
        },
        {
          publisher: { $regex: searchQuery ? searchQuery : "", $options: "i" },
        },
        {
          description: {
            $regex: searchQuery ? searchQuery : "",
            $options: "i",
          },
        },
        {
          "genres.name": {
            $regex: searchQuery ? searchQuery : "",
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

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    await connectToDatabase();

    data.slug = slugify(data.name).toLowerCase();
    const existingProduct = await Product.find({ slug: data.slug });
    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: "Produto já cadastrado!", existingProduct },
        { status: 400 }
      );
    }

    const product = await Product.create({
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

    return NextResponse.json("Produto criado", productWithGenres);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
