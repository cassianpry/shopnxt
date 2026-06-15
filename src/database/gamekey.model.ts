import { Schema, model, models } from "mongoose";

const GameKeySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    key: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["available", "sold", "revoked"],
      default: "available",
    },
    order: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    assignedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

GameKeySchema.index({ product: 1, status: 1 });
GameKeySchema.index({ order: 1 });

const GameKey = models?.GameKey || model("GameKey", GameKeySchema);
export default GameKey;
