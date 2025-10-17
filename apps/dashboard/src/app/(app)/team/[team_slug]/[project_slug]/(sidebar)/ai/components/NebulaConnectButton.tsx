"use client";

import { Spinner } from "@workspace/ui/components/spinner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { ThirdwebClient } from "thirdweb";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { appMetadata } from "@/constants/connect";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { cn } from "@/lib/utils";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export const NebulaConnectWallet = (props: {
  client: ThirdwebClient;
  connectButtonClassName?: string;
  signInLinkButtonClassName?: string;
  detailsButtonClassName?: string;
  customDetailsButton?: (address: string) => React.ReactElement;
}) => {
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
      appMetadata={appMetadata}
      autoConnect={false}
      chains={allChainsV5}
      client={props.client}
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
      // we have an AutoConnect already added in root layout with AA configuration
      theme={getSDKTheme(t)}
    />
  );
};
