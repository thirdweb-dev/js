"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { getSDKTheme } from "app/(app)/components/sdk-component-theme";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { cn } from "../../../../@/lib/utils";
import { doNebulaLogout } from "../../login/auth-actions";

export const NebulaConnectWallet = (props: {
  connectButtonClassName?: string;
  signInLinkButtonClassName?: string;
  detailsButtonClassName?: string;
}) => {
  const thirdwebClient = useThirdwebClient();
  const router = useDashboardRouter();
  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";
  const { allChainsV5 } = useAllChainsData();
  const pathname = usePathname();
  const account = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  if (connectionStatus === "connecting") {
    return (
      <Button
        size="lg"
        disabled
        variant="outline"
        className={cn(
          props.signInLinkButtonClassName,
          "gap-2 disabled:opacity-100",
        )}
      >
        <Spinner className="size-4" /> Connecting Wallet
      </Button>
    );
  }

  if (!account) {
    return (
      <Button
        asChild
        variant="default"
        className={props.signInLinkButtonClassName}
        size="lg"
      >
        <Link
          href={`/login${pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
        >
          Connect Wallet
        </Link>
      </Button>
    );
  }

  return (
    <ConnectButton
      theme={getSDKTheme(t)}
      client={thirdwebClient}
      connectModal={{
        privacyPolicyUrl: "/privacy-policy",
        termsOfServiceUrl: "/terms",
        showThirdwebBranding: false,
      }}
      appMetadata={{
        name: "thirdweb",
        logoUrl: "https://thirdweb.com/favicon.ico",
        url: "https://thirdweb.com",
      }}
      onDisconnect={async () => {
        try {
          await doNebulaLogout();
          router.replace("/login");
        } catch (err) {
          console.error("Failed to log out", err);
        }
      }}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      detailsButton={{
        className: props.detailsButtonClassName,
      }}
      chains={allChainsV5}
    />
  );
};
