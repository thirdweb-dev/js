"use client";

import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import type { Wallet } from "thirdweb/wallets";
import { appMetadata } from "@/constants/connect";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { getSDKTheme } from "@/utils/sdk-component-theme";

const client = getClientThirdwebClient();

export function PublicPageConnectButton(props: {
  connectButtonClassName?: string;
  wallets?: Wallet[];
}) {
  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";
  const { allChainsV5 } = useAllChainsData();

  return (
    <ConnectButton
      appMetadata={appMetadata}
      autoConnect={false}
      chains={allChainsV5}
      client={client}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      detailsButton={{
        className: props.connectButtonClassName,
      }}
      connectModal={{
        privacyPolicyUrl: "/privacy-policy",
        showThirdwebBranding: false,
        termsOfServiceUrl: "/terms",
      }}
      // we have an AutoConnect already added in root layout with AA configuration
      theme={getSDKTheme(t)}
      wallets={props.wallets}
    />
  );
}
