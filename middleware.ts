// middleware.ts
import type { Chain } from "@thirdweb-dev/chains";
import { THIRDWEB_API_HOST } from "constants/urls";
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

async function getChainFromNetworkPath(network: string) {
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/chains/${network}`);
  if (res.ok) {
    try {
      return (await res.json()).data as Chain;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");
  // we're in chain mode, rewrite to `/chain/<slug>`
  if (paths.length === 1 && paths[0] !== "") {
    const chain = await getChainFromNetworkPath(paths[0]);
    // if we found a chain we can do more logic
    if (chain) {
      if (chain.slug !== paths[0]) {
        // redirect to the slug
        return redirect(request, `/${chain.slug}`);
      }
      // otherwise we're at the correct slug
      return rewrite(request, `/chain/${chain.slug}`);
    }
  }
  // end chain mode

  // ignore paths that don't have at least 2 parts
  if (paths.length < 2) {
    return;
  }

  const [networkOrAddress, ...catchAll] = paths;

  // legacy
  const legacyRedirect = handleLegacyRedirects(
    request,
    networkOrAddress,
    catchAll,
  );
  if (legacyRedirect) {
    return legacyRedirect;
  }

  // evm contract page
  // /<network>/... or /<chainId>/...
  if (isPossibleEVMAddress(catchAll[0])) {
    // /<chainId>/... => /evm/<network>/...

    // if networkOrAddress is a Number then it's likely a chainId and we should redirect to the slug instead
    if (!isNaN(Number(networkOrAddress))) {
      const chain = await getChainFromNetworkPath(networkOrAddress);
      if (chain) {
        return redirect(request, `/${chain.slug}/${catchAll.join("/")}`);
      }
    }

    // /<network>/...  => /evm/<network>/...
    return rewrite(request, `/evm${pathname}`);
  }

  if (isPossibleEVMAddress(networkOrAddress)) {
    return rewrite(request, `/publish${pathname}`);
  }
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

function handleLegacyRedirects(
  request: NextRequest,
  networkOrAddress: string,
  catchAll: string[],
) {
  // handle deployer.thirdweb.eth urls
  if (networkOrAddress === "deployer.thirdweb.eth") {
    return redirect(request, `/thirdweb.eth/${catchAll.join("/")}`, true);
  }
}
