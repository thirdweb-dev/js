import { LOGGED_IN_ONLY_PATHS } from "@/constants/auth";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { type NextRequest, NextResponse } from "next/server";
import { getAddress } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import { defineDashboardChain } from "./lib/defineDashboardChain";

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const activeAccount = request.cookies.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authCookie = activeAccount
    ? request.cookies.get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))
    : null;

  // logged in paths
  if (LOGGED_IN_ONLY_PATHS.some((path) => pathname.startsWith(path))) {
    // check if the user is logged in (has a valid auth cookie)

    if (!authCookie) {
      // if not logged in, rewrite to login page
      return redirect(
        request,
        "/login",
        `next=${encodeURIComponent(pathname)}`,
        false,
      );
    }
  }
  // /login redirect
  if (pathname === "/login" && authCookie) {
    // if the user is logged in, redirect to dashboard
    return redirect(request, "/dashboard");
  }

  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");

  // if the first section of the path is a number, check if it's a valid chain_id and re-write it to the slug
  const possibleChainId = Number(paths[0]);

  if (
    possibleChainId &&
    Number.isInteger(possibleChainId) &&
    possibleChainId !== 404
  ) {
    // eslint-disable-next-line no-restricted-syntax
    const possibleChain = defineDashboardChain(possibleChainId, undefined);
    try {
      const chainMetadata = await getChainMetadata(possibleChain);
      if (chainMetadata.slug) {
        return redirect(
          request,
          `/${chainMetadata.slug}/${paths.slice(1).join("/")}`,
        );
      }
    } catch {
      // no-op, we continue with the default routing
    }
  }

  // DIFFERENT DYNAMIC ROUTING CASES

  // /<address>/... case
  if (isPossibleEVMAddress(paths[0])) {
    // special case for "deployer.thirdweb.eth"
    // we want to always redirect this to "thirdweb.eth/..."
    if (paths[0] === "deployer.thirdweb.eth") {
      return redirect(
        request,
        `/thirdweb.eth/${paths.slice(1).join("/")}`,
        undefined,
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
  searchParams?: string,
  permanent = false,
) {
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  url.search = searchParams ? `?${searchParams}` : "";
  return NextResponse.redirect(url, permanent ? 308 : undefined);
}
