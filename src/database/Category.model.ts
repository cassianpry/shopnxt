import { Schema, models, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    slug: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default models.Category || model("Category", CategorySchema);
