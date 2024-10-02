"use client";

import { isLoginRequired } from "@/constants/auth";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useQuery } from "@tanstack/react-query";
import type { EnsureLoginResponse } from "app/api/auth/ensure-login/route";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";

// define "TW_AUTH_TOKEN" to exist on the window object
declare global {
  interface Window {
    TW_AUTH_TOKEN?: string;
  }
}

export function useLoggedInUser(): {
  isPending: boolean;
  isLoggedIn: boolean;
  user: { address: string; jwt?: string } | null;
} {
  const router = useDashboardRouter();
  const pathname = usePathname();
  const connectedAddress = useActiveAccount()?.address;
  const connectionStatus = useActiveWalletConnectionStatus();
  // this is to work around the fact that `connectionStatus` ends up as "disconnected"
  // which we *do* care about, but only after we have been "connecting" at least once
  const [statusWasEverConnecting, setStatusWasEverConnecting] = useState(
    connectionStatus === "connecting" || connectionStatus === "connected",
  );
  // needs to be a useEffect for now
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (connectionStatus === "connecting" || connectionStatus === "connected") {
      setStatusWasEverConnecting(true);
    }
  }, [connectionStatus]);

  const query = useQuery({
    // enabled if:
    // - there is a pathname
    // - we are not already currently connecting
    // - the pathname requires login
    enabled:
      !!pathname &&
      connectionStatus !== "connecting" &&
      statusWasEverConnecting &&
      isLoginRequired(pathname),
    // the last "persist", part of the queryKey, is to make sure that we do not cache this query in indexDB
    // convention in v4 of the SDK that we are (ab)using here
    queryKey: ["logged_in_user", connectedAddress, { persist: false }],
    retry: false,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (pathname) {
        searchParams.set("pathname", pathname);
      }
      if (connectedAddress) {
        searchParams.set("address", connectedAddress);
      }
      const res = await fetch(
        `/api/auth/ensure-login?${searchParams.toString()}`,
        {
          method: "GET",
        },
      );

      return (await res.json()) as EnsureLoginResponse;
    },
  });

  // legit use-case for now
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (query.data?.redirectTo) {
      router.replace(query.data.redirectTo);
    }
  }, [query.data?.redirectTo, router]);

  // if we are "disconnected" we are not logged in
  if (connectionStatus === "disconnected") {
    return {
      isPending: false,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we are still connecting, we are "loading"
  if (connectionStatus === "connecting") {
    return {
      isPending: true,
      isLoggedIn: false,
      user: null,
    };
  }

  // same if we do not yet have a path
  if (!pathname) {
    return {
      isPending: true,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we do not have an address we are not logged in
  if (!connectedAddress) {
    return {
      isPending: false,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we are not on a logged in path, we can simply return the connected address
  if (!isLoginRequired(pathname)) {
    return {
      isPending: false,
      isLoggedIn: true,
      user: { address: connectedAddress },
    };
  }

  // otherwise we return the query data
  return {
    isPending: query.isPending,
    isLoggedIn: query.data ? query.data.isLoggedIn : false,
    user: query.data?.isLoggedIn
      ? { address: connectedAddress, jwt: query.data.jwt }
      : null,
  };
}
