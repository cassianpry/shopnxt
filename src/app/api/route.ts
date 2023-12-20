import { connectToDatabase } from "@/src/database/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ time: new Date().toLocaleString() });
}
