import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/actions/mongoose";
import Coupon from "@/database/coupon.model";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    await connectToDatabase();
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Coupon not found" });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({ valid: false, error: "Coupon not yet valid" });
    }
    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({ valid: false, error: "Coupon expired" });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ valid: false, error: "Coupon usage limit reached" });
    }
    if (cartTotal !== undefined && cartTotal < coupon.minPurchase) {
      return NextResponse.json({ valid: false, error: `Minimum purchase of $${coupon.minPurchase} required` });
    }

    const discountAmount =
      coupon.discountType === "percentage"
        ? (cartTotal * coupon.discountValue) / 100
        : Math.min(coupon.discountValue, cartTotal || 0);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
