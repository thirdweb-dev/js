import { getTeams } from "@/api/team";
import { isLoginRequired } from "@/constants/auth";
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
  let cookiesToSet: Record<string, string> | undefined = undefined;
  const { pathname } = request.nextUrl;
  const activeAccount = request.cookies.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authCookie = activeAccount
    ? request.cookies.get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))
    : null;

  // utm collection
  // NOTE: this is not working for pages with rewrites in next.config.js - (framer pages)
  // if user is already signed in - don't bother capturing utm params
  if (!authCookie) {
    const searchParamsEntries = request.nextUrl.searchParams.entries();
    const utmParams: Map<string, string> = new Map();
    for (const param of searchParamsEntries) {
      if (param[0].startsWith("utm_")) {
        utmParams.set(param[0], param[1]);
      }
    }

    // if we have utm params, set them as cookies
    if (utmParams.size) {
      for (const [key, value] of utmParams.entries()) {
        // if its already set - don't set it again
        if (!request.cookies.get(key)) {
          if (!cookiesToSet) {
            cookiesToSet = {};
          }

          cookiesToSet[key] = value;
        }
      }
    }
  }

  // logged in paths
  if (isLoginRequired(pathname)) {
    // check if the user is logged in (has a valid auth cookie)

    if (!authCookie) {
      const searchParamsString = request.nextUrl.searchParams.toString();

      // if not logged in, rewrite to login page
      return redirect(request, "/login", {
        permanent: false,
        searchParams: `next=${encodeURIComponent(`${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`)}`,
        cookiesToSet,
      });
    }
  }

  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");

  // if it's the homepage and we have an auth cookie, redirect to the dashboard
  if (paths.length === 1 && paths[0] === "" && authCookie) {
    return redirect(
      request,
      "/team",
      cookiesToSet
        ? {
            cookiesToSet,
          }
        : undefined,
    );
  }

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
          cookiesToSet ? { cookiesToSet } : undefined,
        );
      }
    } catch {
      // no-op, we continue with the default routing
    }
  }

  // DIFFERENT DYNAMIC ROUTING CASES

  // /<address>/... case
  if (paths[0] && isPossibleEVMAddress(paths[0])) {
    // special case for "deployer.thirdweb.eth"
    // we want to always redirect this to "thirdweb.eth/..."
    if (paths[0] === "deployer.thirdweb.eth") {
      return redirect(request, `/thirdweb.eth/${paths.slice(1).join("/")}`, {
        permanent: true,
        cookiesToSet,
      });
    }
    // if we have exactly 1 path part, we're in the <address> case -> profile page
    if (paths.length === 1) {
      return rewrite(request, `/profile${pathname}`, cookiesToSet);
    }
    // if we have more than 1 path part, we're in the <address>/<slug> case -> publish page
    if (paths.length > 1) {
      return rewrite(request, `/published-contract${pathname}`, cookiesToSet);
    }
  }

  // redirect /team/~/... to /team/<first_team_slug>/...
  if (paths[0] === "team" && paths[1] === "~") {
    // TODO - need an API to get the first team to avoid fetching all teams
    const teams = await getTeams();
    const firstTeam = teams?.[0];
    if (firstTeam) {
      const modifiedPaths = [...paths];
      modifiedPaths[1] = firstTeam.slug;
      return redirect(request, `/${modifiedPaths.join("/")}`, {
        searchParams: request.nextUrl.searchParams.toString(),
        cookiesToSet,
      });
    }
  }
  // END /<address>/... case
  // all other cases are handled by the file system router so we just fall through
  if (cookiesToSet) {
    const defaultResponse = NextResponse.next();
    for (const entry of Object.entries(cookiesToSet)) {
      defaultResponse.cookies.set(entry[0], entry[1]);
    }

    return defaultResponse;
  }
}

function isPossibleEVMAddress(address: string) {
  return address?.startsWith("0x") || address?.endsWith(".eth");
}

// utils for rewriting and redirecting with relative paths

function rewrite(
  request: NextRequest,
  relativePath: string,
  cookiesToSet: Record<string, string> | undefined,
) {
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  const res = NextResponse.rewrite(url);

  if (cookiesToSet) {
    for (const entry of Object.entries(cookiesToSet)) {
      res.cookies.set(entry[0], entry[1]);
    }
  }

  return res;
}

function redirect(
  request: NextRequest,
  relativePath: string,
  options:
    | {
        searchParams?: string;
        permanent?: boolean;
        cookiesToSet?: Record<string, string> | undefined;
      }
    | undefined,
) {
  const permanent = options?.permanent ?? false;
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  url.search = options?.searchParams ? `?${options.searchParams}` : "";
  const res = NextResponse.redirect(url, permanent ? 308 : undefined);

  if (options?.cookiesToSet) {
    for (const entry of Object.entries(options.cookiesToSet)) {
      res.cookies.set(entry[0], entry[1]);
    }
  }

  return res;
}
