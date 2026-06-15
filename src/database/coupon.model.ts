import { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    validFrom: { type: Date },
    validUntil: { type: Date },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CouponSchema.index({ validFrom: 1, validUntil: 1 });

const Coupon = models?.Coupon || model("Coupon", CouponSchema);
export default Coupon;
