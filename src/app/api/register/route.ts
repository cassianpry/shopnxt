import bcrypt from "bcrypt";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const body = await req.json();
  try {
    await connectToDatabase();

    //Validation if a email or username exists in DB
    const existingUser = await User.findOne({
      email: body.email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "E-mail já existente!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });
    return NextResponse.json("Usuário Criado!");
  } catch (error) {
    return NextResponse.json(error);
  }
}
