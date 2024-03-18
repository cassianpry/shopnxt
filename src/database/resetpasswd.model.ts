import { Schema, model, models } from "mongoose";

const ResetPasswordSchema = new Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    user: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        email: { type: String },
      },
    ],
    resetAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const ResetPassword =
  models?.ResetPassword || model("ResetPassword", ResetPasswordSchema);

export default ResetPassword;
