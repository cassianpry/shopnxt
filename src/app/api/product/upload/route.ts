// @ts-nocheck
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

const UploadImageSchema = z.object({
  image: z.string().min(1, "Image is required"),
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const parsed = UploadImageSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { image } = parsed.data;

    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        public_id: "product",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "jfif", "tiff", "webp"],
      },
      function (error, result) {
        if (error) {
          return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        } else {
          return NextResponse.json(result, { status: 200 });
        }
      }
    );
    return NextResponse.json(uploadedImage, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
