import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    productImage: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    about: { type: String, required: true },
    genres: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Genres", required: true },
        name: { type: String, required: true },
      },
    ],
    developer: { type: String, required: true },
    publisher: { type: String, required: true },
    system: { type: String, required: true },
    processor: { type: String, required: true },
    memory: { type: String, required: true },
    storage: { type: String, required: true },
    graphicCard: { type: String, required: true },
    price: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Product = models?.Product || model("Product", ProductSchema);
