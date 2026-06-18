import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Library from "@/database/library.model";
import type { SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    if (!sessionUser?._id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await connectToDatabase();
    const library = await Library.findOne({ user: sessionUser._id })
      .populate("products.product");

    return NextResponse.json(library ?? { products: [] });
  } catch (error) {
    return serverError(error);
  }
}
