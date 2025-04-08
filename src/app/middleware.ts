import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "mysecretkey") as { id: string };

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("userId", decoded.id); 

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/api/v1/:path*"], 
};
