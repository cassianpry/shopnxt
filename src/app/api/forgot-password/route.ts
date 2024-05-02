import bcrypt from "bcrypt";
import ResetPassword from "@/database/resetpasswd.model";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { FilterQuery } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { nullable } from "zod";

export async function GET(req: NextRequest) {
  const searchQuery = new URL(
    req.url,
    `${process.env.BASE_URL}`
  ).searchParams.get("token");
  try {
    await connectToDatabase();

    const query: FilterQuery<typeof ResetPassword> = {};

    if (searchQuery !== "undefined") {
      query.$or = [{ token: { $regex: searchQuery, $options: "i" } }];
      const checkToken = await ResetPassword.findOne(query);

      if (checkToken === null) throw new Error("Invalid token");
      const tokenDate = new Date(checkToken.resetAt);
      const atualDate = new Date();

      tokenDate.setHours(tokenDate.getHours() + 4);

      if (atualDate < tokenDate === false || checkToken.length === 0) {
        await ResetPassword.deleteOne({ _id: checkToken._id });
        return NextResponse.json(
          { error: "Token expirado ou não existe." },
          { status: 404 }
        );
      }

      console.log(atualDate > tokenDate);

      return NextResponse.json({ checkToken }, { status: 200 });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    throw new Error();
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);

  delete body.confirm_password;

  try {
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      body.userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    await ResetPassword.deleteOne({ userId: body.userId });

    return NextResponse.json("ok");
  } catch (error) {
    console.log(error);
    return NextResponse.json((error as Error).message, { status: 500 });
  }
}
