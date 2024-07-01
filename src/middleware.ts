//export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

interface CustomNextRequest extends NextRequest {
  nextauth?: {
    token?: {
      user?: {
        role?: string | null | undefined;
      };
    };
  };
}

export const config = {
  matcher: ["/dashboard/:path*", "/cart", "/profile/:path*", "/api/:path*"],
};

export default (withAuth as any)(
  async function (
    req: CustomNextRequest
  ): Promise<NextMiddlewareResult | undefined> {
    const url = req?.nextUrl?.pathname;
    const userRole = req?.nextauth?.token?.user?.role;
    if (
      (url?.includes("/dashboard") || url?.includes("/api")) &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => {
        if (!token) {
          return false;
        }
      },
    },
  }
);
