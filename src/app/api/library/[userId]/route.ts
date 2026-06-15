import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Library from "@/database/library.model";

interface ContextProps {
  params: Promise<{ userId: string }>;
}

export async function GET(req: NextRequest, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string } | null;
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
