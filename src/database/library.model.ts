import { Schema, model, models } from "mongoose";

const LibrarySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        keys: [String],
        purchasedAt: { type: Date, default: Date.now },
        orderNum: String,
      },
    ],
  },
  { timestamps: true }
);

LibrarySchema.index({ "products.product": 1 });

const Library = models?.Library || model("Library", LibrarySchema);
export default Library;
