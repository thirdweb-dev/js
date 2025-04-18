"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export function EnsureValidConnectedWalletLoginClient(props: {
  loggedInAddress: string;
}) {
  const router = useDashboardRouter();
  const connectedAddress = useActiveAccount()?.address;

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!connectedAddress) {
      return;
    }

    if (connectedAddress !== props.loggedInAddress) {
      const currentHref = new URL(window.location.href);
      const currentPathname = currentHref.pathname;
      const currentSearchParams = currentHref.searchParams.toString();
      router.replace(
        buildLoginPath(
          `${currentPathname}${currentSearchParams ? `?${currentSearchParams}` : ""}`,
        ),
      );
    }
  }, [connectedAddress, props.loggedInAddress, router]);

  return null;
}

function buildLoginPath(pathname: string | undefined): string {
  return `/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`;
}
