import bcrypt from "bcrypt";
import crypto from "crypto";
import ResetPassword from "@/database/resetpasswd.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { ResetPasswordSchema } from "@/lib/actions/validations";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchQuery = new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("token");
  try {
    await connectToDatabase();

    if (searchQuery && searchQuery !== "undefined") {
      const hashedToken = crypto.createHash("sha256").update(searchQuery).digest("hex");
      const checkToken = await ResetPassword.findOne({ token: hashedToken });

      if (checkToken === null) {
        return NextResponse.json(
          { error: "Token expirado ou não existe." },
          { status: 404 }
        );
      }

      const tokenDate = new Date(checkToken.resetAt);
      const atualDate = new Date();

      tokenDate.setHours(tokenDate.getHours() + 4);

      if (atualDate >= tokenDate) {
        await ResetPassword.deleteOne({ _id: checkToken._id });
        return NextResponse.json(
          { error: "Token expirado ou não existe." },
          { status: 404 }
        );
      }

      return NextResponse.json({ userId: checkToken.userId }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Token não fornecido." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userId, password } = parsed.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectToDatabase();

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { returnDocument: 'after' }
    );

    await ResetPassword.deleteOne({ userId });

    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
