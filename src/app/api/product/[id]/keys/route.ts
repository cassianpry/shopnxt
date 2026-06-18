import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import GameKey from "@/database/gamekey.model";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"id">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    await connectToDatabase();

    const keys = await GameKey.find({ product: id }).sort({ createdAt: -1 });
    const available = keys.filter((k) => k.status === "available").length;
    const sold = keys.filter((k) => k.status === "sold").length;

    return NextResponse.json({ keys, stats: { total: keys.length, available, sold } });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest, context: RouteParams<"id">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    const { keys } = await req.json();

    if (!Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ error: "Keys array required" }, { status: 400 });
    }

    await connectToDatabase();

    const keyDocuments = keys.map((key: string) => ({
      product: id,
      key,
    }));

    const created = await GameKey.insertMany(keyDocuments, { ordered: false });

    return NextResponse.json({ created: created.length }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
