// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";

//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { image } = data;

  try {
    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        upload_preset: "unsigned_upload",
        public_id: "product",
        allowed_formats: ["png", "jpg", "jpeg", "svg", "jfif", "tiff", "webp"],
      },
      function (error, result) {
        if (error) {
          return NextResponse.json((error as Error).message, { status: 500 });
        } else {
          return NextResponse.json(result, { status: 200 });
        }
      }
    );
    return NextResponse.json(uploadedImage, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
