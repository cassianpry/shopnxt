import { withAuth } from "next-auth/middleware";
import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_API_ROUTES = [
  "/api/auth",
  "/api/register",
  "/api/forgot-password",
];

const PUBLIC_READ_API_ROUTES = ["/api/product", "/api/genre"];

export const config = {
  matcher: ["/dashboard/:path*", "/cart", "/profile/:path*", "/api/:path*"],
};

export const proxy = (withAuth as any)(
  async function middleware(req: NextRequest): Promise<NextResponse | void> {
    const url = req.nextUrl.pathname;
    const token: JWT | null = (req as any).nextauth?.token ?? null;

    const isFullyPublic = PUBLIC_API_ROUTES.some((route) =>
      url.startsWith(route),
    );
    if (isFullyPublic) {
      return;
    }

    const isPublicRead = PUBLIC_READ_API_ROUTES.some((route) =>
      url.startsWith(route),
    );

    if (url.startsWith("/api") && isPublicRead && req.method === "GET") {
      return;
    }

    if (!token) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", url);
      return NextResponse.redirect(signInUrl);
    }

    const userRole = (token.user as { role?: string })?.role;

    if (url.startsWith("/dashboard") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      url.startsWith("/api") &&
      isPublicRead &&
      req.method !== "GET" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => {
        return true;
      },
    },
  },
);

export default proxy;
