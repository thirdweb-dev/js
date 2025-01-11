"use client";

import { isWalletValidForActiveAccount } from "@/actions/validLogin";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { useActiveAccount } from "thirdweb/react";

export function EnsureValidConnectedWalletLoginClient(props: {
  account: Account;
  authToken: string;
}) {
  const router = useDashboardRouter();
  const connectedAddress = useActiveAccount()?.address;

  useQuery({
    queryKey: [
      "EnsureValidLogin",
      connectedAddress,
      props.account,
      props.authToken,
      { persist: false },
    ],
    retry: false,
    enabled: !!connectedAddress,
    queryFn: async () => {
      if (!connectedAddress) {
        throw new Error("No connected address");
      }

      const isValidLogin = await isWalletValidForActiveAccount({
        address: connectedAddress,
        account: props.account,
        authToken: props.authToken,
      });

      // directly doing side-effects in query instead of useEffect
      // to avoid doing this multiple times on re-renders
      if (!isValidLogin) {
        const currentHref = new URL(window.location.href);
        const currentPathname = currentHref.pathname;
        const currentSearchParams = currentHref.searchParams.toString();
        router.replace(
          buildLoginPath(
            `${currentPathname}${currentSearchParams ? `?${currentSearchParams}` : ""}`,
          ),
        );
      }

      return isValidLogin;
    },
  });

  return null;
}

function buildLoginPath(pathname: string | undefined): string {
  return `/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`;
}
