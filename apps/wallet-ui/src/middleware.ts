import { type NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "thirdweb/utils";

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

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get the request hostname (e.g. demo.thirdweb.com)
  const hostname = req.headers.get("host");

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /assets, /details)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // keep root application at `/`
  if (hostname === ROOT_DOMAIN || hostname === null) {
    return NextResponse.rewrite(
      new URL(`/${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[ecosystem]/... dynamic route
  const ecosystem = hostname.split(".")[0];

  // Send them to the wallet page for the current jwt
  const jwt = (() => {
    try {
      return decodeJWT(req.cookies.get("jwt")?.value ?? "");
    } catch {
      return undefined;
    }
  })();
  const user = jwt?.payload.sub;

  if (user) {
    return NextResponse.rewrite(
      new URL(`/${ecosystem}/wallet/${user}?${searchParams}`, req.url),
    );
  }

  return NextResponse.rewrite(new URL(`/${ecosystem}/login`, req.url));
}
