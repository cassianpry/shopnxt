import { Schema, models, model, Model } from "mongoose";

interface IGenre extends Document {
  name: string;
  slug: string;
}

const GenresSchema = new Schema<IGenre>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

export const Genres: Model<IGenre> =
  models?.Genres || model("Genres", GenresSchema);
