import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: ["/signup", "/verify/:path*"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);

      if (
        pathname.startsWith("/signup") ||
        pathname.startsWith("/verify")
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    return NextResponse.next();
  }
}
