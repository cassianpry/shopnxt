import { Schema, model, models } from "mongoose";
import crypto from "crypto";

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

ResetPasswordSchema.pre("save", async function () {
  if (this.isModified("token")) {
    this.token = crypto.createHash("sha256").update(this.token).digest("hex");
  }
});

const ResetPassword =
  models?.ResetPassword || model("ResetPassword", ResetPasswordSchema);

export default ResetPassword;
