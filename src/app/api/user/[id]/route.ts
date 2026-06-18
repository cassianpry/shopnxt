import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import type { RouteParams, SessionUser } from "@/lib/api/shared";

export async function GET(req: NextRequest, context: RouteParams<"id">) {
  const params = await context.params;

  try {
    await connectToDatabase();

    const user = await User.findById(params.id);
    user.password = null;
    console.log(user);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteParams<"id">) {
  const data = await req.json();
  const params = await context.params;

  try {
    await connectToDatabase();

    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const sessionUser = session.user as SessionUser;
    if (sessionUser._id !== params.id && sessionUser.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const updateFields: Record<string, string> = {
      name: data.name,
      email: data.email?.toLowerCase(),
      address: data.address,
      postalCode: data.postalCode,
      phone: data.phone,
      city: data.city,
      state: data.state,
    };

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    return NextResponse.json("Usuário alterado", user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
