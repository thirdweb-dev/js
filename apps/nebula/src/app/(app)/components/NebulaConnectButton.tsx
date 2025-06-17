"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { useAllChainsData } from "@/hooks/chains";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { doNebulaLogout } from "../../login/auth-actions";

export const NebulaConnectWallet = (props: {
  connectButtonClassName?: string;
  signInLinkButtonClassName?: string;
  detailsButtonClassName?: string;
  customDetailsButton?: (address: string) => React.ReactElement;
}) => {
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

  const { customDetailsButton } = props;
  return (
    <ConnectButton
      theme={getSDKTheme(t)}
      client={nebulaAppThirdwebClient}
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
        render: customDetailsButton
          ? () => customDetailsButton(account.address)
          : undefined,
      }}
      chains={allChainsV5}
      // we have an AutoConnect already added in root layout with AA configuration
      autoConnect={false}
    />
  );
};
