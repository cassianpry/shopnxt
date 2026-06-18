import { NextResponse } from "next/server";

export interface SessionUser {
  _id?: string;
  role?: string;
  email?: string;
}

export type RouteParams<T extends string> = {
  params: Promise<{ [K in T]: string }>;
};

export function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

export function errorMessage(error: unknown) {
  return NextResponse.json((error as Error).message, { status: 500 });
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
