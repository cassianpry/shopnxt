// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

export const proxy = (withAuth as any)(
  async function proxy(req: CustomNextRequest): Promise<NextResponse | void> {
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

        return true;
      },
    },
  }
);

export default proxy;
