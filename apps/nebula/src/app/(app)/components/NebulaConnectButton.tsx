"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { getSDKTheme } from "@/config/sdk-component-theme";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { useAllChainsData } from "@/hooks/chains";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
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
        className={cn(
          props.signInLinkButtonClassName,
          "gap-2 disabled:opacity-100",
        )}
        disabled
        size="lg"
        variant="outline"
      >
        <Spinner className="size-4" /> Connecting Wallet
      </Button>
    );
  }

  if (!account) {
    return (
      <Button
        asChild
        className={props.signInLinkButtonClassName}
        size="lg"
        variant="default"
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
      appMetadata={{
        logoUrl: "https://thirdweb.com/favicon.ico",
        name: "thirdweb",
        url: "https://thirdweb.com",
      }}
      autoConnect={false}
      chains={allChainsV5}
      client={nebulaAppThirdwebClient}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      connectModal={{
        privacyPolicyUrl: "/privacy-policy",
        showThirdwebBranding: false,
        termsOfServiceUrl: "/terms",
      }}
      detailsButton={{
        className: props.detailsButtonClassName,
        render: customDetailsButton
          ? () => customDetailsButton(account.address)
          : undefined,
      }}
      onDisconnect={async () => {
        try {
          await doNebulaLogout();
          router.replace("/login");
        } catch (err) {
          console.error("Failed to log out", err);
        }
      }}
      // we have an AutoConnect already added in root layout with AA configuration
      theme={getSDKTheme(t)}
    />
  );
};
