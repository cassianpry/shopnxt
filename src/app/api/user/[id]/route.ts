import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/actions/mongoose";
import { NextRequest, NextResponse } from "next/server";

interface contextProps {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: contextProps) {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id);
    user.password = null;
    console.log(user);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: contextProps) {
  const data = await req.json();
  const { params } = context;

  try {
    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: data.name,
          email: data.email.toLowerCase(),
          address: data.address,
          postalCode: data.postalCode,
          phone: data.phone,
          city: data.city,
          state: data.state,
          role: data.role,
        },
      },
      { new: true }
    );

    return NextResponse.json("Usuário alterado", user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
