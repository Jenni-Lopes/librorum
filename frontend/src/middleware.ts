import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "librorum:token";
const privateRoutes = ["/", "/livro", "/perfil"];
const authRoutes = ["/login", "/cadastro"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;
  const isPrivateRoute = privateRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/livro/:path*", "/perfil/:path*", "/login", "/cadastro"],
};
