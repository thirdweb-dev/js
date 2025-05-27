"use client";

import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getSDKTheme } from "app/(app)/components/sdk-component-theme";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";

const client = getClientThirdwebClient();

export function PublicPageConnectButton(props: {
  connectButtonClassName?: string;
}) {
  const { theme } = useTheme();
  const t = theme === "light" ? "light" : "dark";
  const { allChainsV5 } = useAllChainsData();

  return (
    <ConnectButton
      theme={getSDKTheme(t)}
      client={client}
      connectModal={{
        privacyPolicyUrl: "/privacy-policy",
        termsOfServiceUrl: "/terms",
        showThirdwebBranding: false,
      }}
      connectButton={{
        className: props.connectButtonClassName,
      }}
      appMetadata={{
        name: "thirdweb",
        logoUrl: "https://thirdweb.com/favicon.ico",
        url: "https://thirdweb.com",
      }}
      chains={allChainsV5}
      // we have an AutoConnect already added in root layout with AA configuration
      autoConnect={false}
    />
  );
}
