import { Schema, models, model } from "mongoose";

interface IGenre {
  name: string;
  slug: string;
}

const GenresSchema = new Schema<IGenre>(
  { name: { type: String, required: true }, slug: { type: String, required: true, unique: true } },
  { timestamps: true }
);

const Genres = models?.Genres || model("Genres", GenresSchema);
export default Genres;
