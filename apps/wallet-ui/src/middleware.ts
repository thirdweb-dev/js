import { type NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get the request hostname (e.g. demo.thirdweb.com)
  const hostname = req.headers.get("host");

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /assets, /details)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // keep root application at `/`
  if (hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(
      new URL(`/${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[ecosystem]/... dynamic route
  const ecosystem = hostname.split(".")[0];
  return NextResponse.rewrite(new URL(`/${ecosystem}${path}`, req.url));
}
