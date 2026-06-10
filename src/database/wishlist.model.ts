import { Schema, models, model } from "mongoose";

const WishListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  },
  { timestamps: true }
);

const WishList = models?.WishList || model("WishList", WishListSchema);

export default WishList;
