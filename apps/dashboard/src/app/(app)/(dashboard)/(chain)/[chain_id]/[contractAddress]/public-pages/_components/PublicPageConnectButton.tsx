"use client";

import { getSDKTheme } from "app/(app)/components/sdk-component-theme";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";

const client = getClientThirdwebClient();

export function PublicPageConnectButton(props: {
  connectButtonClassName?: string;
}) {
  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";
  const { allChainsV5 } = useAllChainsData();

  return (
    <ConnectButton
      appMetadata={{
        logoUrl: "https://thirdweb.com/favicon.ico",
        name: "thirdweb",
        url: "https://thirdweb.com",
      }}
      autoConnect={false}
      chains={allChainsV5}
      client={client}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      connectModal={{
        privacyPolicyUrl: "/privacy-policy",
        showThirdwebBranding: false,
        termsOfServiceUrl: "/terms",
      }}
      // we have an AutoConnect already added in root layout with AA configuration
      theme={getSDKTheme(t)}
    />
  );
}
