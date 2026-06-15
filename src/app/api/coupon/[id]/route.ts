import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Coupon from "@/database/coupon.model";

interface ContextProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: ContextProps) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string } | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await context.params;
    const data = await req.json();

    await connectToDatabase();
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
