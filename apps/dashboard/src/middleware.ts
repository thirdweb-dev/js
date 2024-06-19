// middleware.ts
import { NextRequest, NextResponse } from "next/server";

// ignore assets, api - only intercept page routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets/
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");

  // DIFFERENT DYNAMIC ROUTING CASES

  // /<address>/... case
  if (isPossibleEVMAddress(paths[0])) {
    // special case for "deployer.thirdweb.eth"
    // we want to always redirect this to "thirdweb.eth/..."
    if (paths[0] === "deployer.thirdweb.eth") {
      return redirect(
        request,
        `/thirdweb.eth/${paths.slice(1).join("/")}`,
        true,
      );
    }
    // if we have exactly 1 path part, we're in the <address> case -> profile page
    if (paths.length === 1) {
      return rewrite(request, `/profile${pathname}`);
    }
    // if we have more than 1 path part, we're in the <address>/<slug> case -> publish page
    if (paths.length > 1) {
      return rewrite(request, `/publish${pathname}`);
    }
  }
  // END /<address>/... case
  // all other cases are handled by the file system router so we just fall through
}

function isPossibleEVMAddress(address: string) {
  return address?.startsWith("0x") || address?.endsWith(".eth");
}

// utils for rewriting and redirecting with relative paths

function rewrite(request: NextRequest, relativePath: string) {
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  return NextResponse.rewrite(url);
}

function redirect(
  request: NextRequest,
  relativePath: string,
  permanent = false,
) {
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  return NextResponse.redirect(url, permanent ? 308 : undefined);
}
