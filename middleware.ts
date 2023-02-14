// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllChainRecords } from "utils/allChainsRecords";
import {
  getSolNetworkFromNetworkPath,
  isSupportedSOLNetwork,
} from "utils/solanaUtils";

// ignore assets, api - only intercept page routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// used for resolving chainId to network slug with constant time lookup
const { chainIdToChain } = getAllChainRecords();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // remove '/' in front and then split by '/'
  const paths = pathname.slice(1).split("/");

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

  // solana contract page
  if (isSupportedSOLNetwork(networkOrAddress)) {
    const solNetwork = getSolNetworkFromNetworkPath(networkOrAddress);
    if (!solNetwork) {
      return redirect(request, "/404");
    } else {
      return rewrite(request, `/solana${pathname}`);
    }
  }
  // evm contract page
  // /<network>/... or /<chainId>/...
  if (isPossibleEVMAddress(catchAll[0])) {
    // /<chainId>/... => /evm/<network>/...
    if (networkOrAddress in chainIdToChain) {
      const networkInfo = chainIdToChain[Number(networkOrAddress)];
      // can not use rewrite here because slug is required client side for resolving the network
      return redirect(request, `/${networkInfo.slug}/${catchAll.join("/")}`);
    }

    // /<network>/...  => /evm/<network>/...
    return rewrite(request, `/evm${pathname}`);
  }

  if (isPossibleEVMAddress(networkOrAddress)) {
    return rewrite(request, `/release${pathname}`);
  }
}

function isPossibleEVMAddress(address: string) {
  return address.startsWith("0x") || address.endsWith(".eth");
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
  // handle old dashboard urls
  if (networkOrAddress === "dashboard") {
    const destination = catchAll.join("/");
    return redirect(request, `/${destination}`);
  }

  // handle deployer.thirdweb.eth urls
  if (networkOrAddress === "deployer.thirdweb.eth") {
    return redirect(request, `/thirdweb.eth/${catchAll.join("/")}`, true);
  }
}
