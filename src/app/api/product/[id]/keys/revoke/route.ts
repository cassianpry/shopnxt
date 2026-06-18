import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import GameKey from "@/database/gamekey.model";
import type { RouteParams, SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function PATCH(req: NextRequest, context: RouteParams<"id">) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    const { keyId } = await req.json();

    await connectToDatabase();
    const key = await GameKey.findOneAndUpdate(
      { _id: keyId, product: id },
      { $set: { status: "revoked" } },
      { new: true }
    );

    if (!key) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    return NextResponse.json(key);
  } catch (error) {
    return serverError(error);
  }
}
