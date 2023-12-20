import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/src/database/dbConnect";
import User from "@/src/database/User.model";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    await connectToDatabase();
    /* The validation is done by a mongoDB plugin in User.model. */

    //Validation if a email or username exists in DB
    // const existingUser = await User.findOne({
    //   $or: [{ username: body.username }, { email: body.email }],
    // });

    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "Username or email already exists" },
    //     { status: 400 }
    //   );
    // }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    await User.create({
      name: body.name,
      username: body.username,
      email: body.email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: "User created" });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
