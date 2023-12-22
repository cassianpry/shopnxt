import bcrypt from "bcrypt";
import { Schema, models, model, Document, CallbackError } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface IResetCode {
  data: string;
  expiresAt: Date;
}

interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  state?: string;
  city?: string;
  address?: string;
  resetCode: IResetCode;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "E-mail is required"],
      index: true,
      lowercase: true,
      unique: true,
      trim: true,
      minLength: 8,
      maxLength: 30,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "user",
    },
    avatar: {
      type: String,
      default: "/assets/images/default_avatar.png",
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    resetCode: {
      data: String,
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000), //10 minutes
      },
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  // Apenas gera a senha se ela não foi fornecida manualmente (pode ser melhorada)
  if (this.isModified("password") || !this.password) {
    try {
      // Gera um hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      // Define a senha no modelo
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  } else {
    return next();
  }
});

UserSchema.plugin(uniqueValidator, {
  message: "\n\nErro, {PATH} já cadastrado. ",
});

export default models.User || model("User", UserSchema);
