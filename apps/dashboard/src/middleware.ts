import { type NextRequest, NextResponse } from "next/server";
import { getAddress } from "thirdweb";
import { COOKIE_ACTIVE_ACCOUNT, COOKIE_PREFIX_TOKEN } from "@/constants/cookie";
import { defineDashboardChain } from "@/lib/defineDashboardChain";
import { isLoginRequired } from "@/utils/auth";
import { LAST_VISITED_TEAM_PAGE_PATH } from "./app/(app)/team/components/last-visited-page/consts";

type CookiesToSet = Record<
  string,
  | [string]
  | [
      string,
      {
        httpOnly: boolean;
        sameSite?: "lax" | "strict" | "none";
        secure: boolean;
        maxAge: number;
      },
    ]
>;

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
     * - sitemap.xml, sitemap-0.xml, robots.txt, favicon.ico, some favicon images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml|sitemap-0.xml|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // nebula subdomain handling
  const paths = pathname.slice(1).split("/");

  let cookiesToSet: CookiesToSet = {};

  const activeAccount = request.cookies.get(COOKIE_ACTIVE_ACCOUNT)?.value;
  const authCookie = activeAccount
    ? request.cookies.get(COOKIE_PREFIX_TOKEN + getAddress(activeAccount))
    : null;

  // utm collection
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

          cookiesToSet[key] = [value];
        }
      }
    }
  }

  // handle gclid (if it exists in search params)
  const gclid = searchParams.get("gclid");
  if (gclid) {
    cookiesToSet.gclid = [
      gclid,
      {
        // TODO: define conversion window, for now 7d should do fine
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: false,
        sameSite: "lax",
        secure: true,
      },
    ];
  }

  // logged in paths
  if (isLoginRequired(pathname)) {
    // check if the user is logged in (has a valid auth cookie)

    if (!authCookie) {
      const searchParamsString = request.nextUrl.searchParams.toString();

      // if not logged in, rewrite to login page
      return redirect(request, "/login", {
        cookiesToSet,
        permanent: false,
        searchParams: `next=${encodeURIComponent(`${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`)}`,
      });
    }
  }

  // if it's the homepage and we have an auth cookie, redirect to the dashboard
  if (paths.length === 1 && paths[0] === "" && authCookie) {
    const lastVisitedTeamPagePath = request.cookies.get(
      LAST_VISITED_TEAM_PAGE_PATH,
    )?.value;

    return redirect(
      request,
      lastVisitedTeamPagePath || "/team",
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
  if (paths[0] && isPossibleAddressOrENSName(paths[0])) {
    // special case for "deployer.thirdweb.eth"
    // we want to always redirect this to "thirdweb.eth/..."
    if (paths[0] === "deployer.thirdweb.eth") {
      return redirect(request, `/thirdweb.eth/${paths.slice(1).join("/")}`, {
        cookiesToSet,
        permanent: true,
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

  // END /<address>/... case
  // all other cases are handled by the file system router so we just fall through
  if (cookiesToSet) {
    const defaultResponse = NextResponse.next();
    for (const entry of Object.entries(cookiesToSet)) {
      defaultResponse.cookies.set(entry[0], entry[1][0], entry[1][1]);
    }

    return defaultResponse;
  }
}

function isPossibleAddressOrENSName(address: string) {
  return address.startsWith("0x") || isValidENSName(address);
}

// utils for rewriting and redirecting with relative paths

function rewrite(
  request: NextRequest,
  relativePath: string,
  cookiesToSet: CookiesToSet,
) {
  const url = request.nextUrl.clone();
  url.pathname = relativePath;
  const res = NextResponse.rewrite(url);

  if (cookiesToSet) {
    for (const entry of Object.entries(cookiesToSet)) {
      res.cookies.set(entry[0], entry[1][0], entry[1][1]);
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
        cookiesToSet?: CookiesToSet;
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
      res.cookies.set(entry[0], entry[1][0], entry[1][1]);
    }
  }

  return res;
}
