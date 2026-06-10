import { Schema, models, model } from "mongoose";

interface IGenre {
  name: string;
  slug: string;
}

const GenresSchema = new Schema<IGenre>(
  { name: { type: String, required: true }, slug: { type: String, required: true } },
  { timestamps: true }
);

export const Genres = models?.Genres || model("Genres", GenresSchema);
