import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Library from "@/database/library.model";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"userId">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { userId } = await context.params;
    await connectToDatabase();

    const library = await Library.findOne({ user: userId })
      .populate("products.product");

    return NextResponse.json(library ?? { products: [] });
  } catch (error) {
    return serverError(error);
  }
}
