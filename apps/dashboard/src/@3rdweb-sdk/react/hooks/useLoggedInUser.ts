import { isLoginRequired } from "@/constants/auth";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
  useConnectionManager,
  useIsAutoConnecting,
} from "thirdweb/react";
import type { isLoggedInResponseType } from "../../../app/api/auth/isloggedin/route";
import { useCustomConnectModal } from "../components/connect-wallet";

function useIsConnectionStatusSettled() {
  const manager = useConnectionManager();
  const isAutoConnecting = useIsAutoConnecting();
  const connectionStatus = useActiveWalletConnectionStatus();

  // handle autoConnect stuck in `true` state
  // this should already be handled by AutoConnect component - but if the page does not have AutoConnect component for some reason
  // timeout auto-connecting after 15 seconds
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (manager.isAutoConnecting.getValue()) {
        manager.isAutoConnecting.setValue(false);
      }
    }, 15000);

    return () => {
      clearTimeout(timeout);
    };
  }, [manager]);

  const connectionStatusIsSettled =
    !isAutoConnecting && connectionStatus !== "connecting";

  return connectionStatusIsSettled;
}

// define "TW_AUTH_TOKEN" to exist on the window object
declare global {
  interface Window {
    TW_AUTH_TOKEN?: string;
  }
}

export function useLoggedInUser(): {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: { address: string; jwt?: string } | null;
} {
  const openConnectModal = useCustomConnectModal();

  const pathname = usePathname();
  const connectedAddress = useActiveAccount()?.address;
  const connectionSettled = useIsConnectionStatusSettled();
  const connectionStatus = useActiveWalletConnectionStatus();

  const enabled = !!pathname && connectionSettled && isLoginRequired(pathname);

  const query = useQuery({
    // enabled if:
    // - there is a pathname
    // - we are not already currently connecting
    // - the pathname requires login
    enabled: enabled,
    // the last "persist", part of the queryKey, is to make sure that we do not cache this query in indexDB
    // convention in v4 of the SDK that we are (ab)using here
    queryKey: ["logged_in_user", connectedAddress, { persist: false }],
    retry: false,
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (connectedAddress) {
        searchParams.set("address", connectedAddress);
      }
      const res = await fetch(
        `/api/auth/isloggedin?address=${connectedAddress}`,
        {
          method: "GET",
        },
      );

      return (await res.json()) as isLoggedInResponseType;
    },
    onSuccess: async (data) => {
      if (data.isLoggedIn) {
        // necessary for legacy things for now (SDK picks it up from there)
        // eslint-disable-next-line react-compiler/react-compiler
        window.TW_AUTH_TOKEN = data.jwt;
      } else {
        window.TW_AUTH_TOKEN = undefined;
        try {
          await openConnectModal({
            dismissible: false,
          });
          // invalidate loggedin-user query
          query.refetch();
        } catch (e) {
          // if a modal is already open, it throws an error
          console.warn("Did not open connect modal", e);
        }
      }
    },
  });

  // if we are "disconnected" we are not logged in
  if (connectionStatus === "disconnected") {
    return {
      isLoading: false,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we are still connecting, we are "loading"
  if (connectionStatus === "connecting") {
    return {
      isLoading: true,
      isLoggedIn: false,
      user: null,
    };
  }

  // same if we do not yet have a path
  if (!pathname) {
    return {
      isLoading: true,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we do not have an address we are not logged in
  if (!connectedAddress) {
    return {
      isLoading: false,
      isLoggedIn: false,
      user: null,
    };
  }

  // if we are not on a logged in path, we can simply return the connected address
  if (!isLoginRequired(pathname)) {
    return {
      isLoading: false,
      isLoggedIn: true,
      user: { address: connectedAddress },
    };
  }

  // otherwise we return the query data
  return {
    isLoading: query.isLoading,
    isLoggedIn: query.data ? query.data.isLoggedIn : false,
    user: query.data?.isLoggedIn
      ? { address: connectedAddress, jwt: query.data.jwt }
      : null,
  };
}
