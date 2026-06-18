import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Coupon from "@/database/coupon.model";
import type { SessionUser } from "@/lib/api/shared";
import { serverError } from "@/lib/api/shared";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await connectToDatabase();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as SessionUser | null;
    const isAdmin = sessionUser?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const data = await req.json();
    await connectToDatabase();

    const coupon = await Coupon.create(data);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
