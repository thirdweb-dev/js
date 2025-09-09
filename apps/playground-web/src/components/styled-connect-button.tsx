"use client";

import { useTheme } from "next-themes";
import {
  abstract,
  apechain,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  ethereum,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "thirdweb/chains";
import type { ConnectButtonProps } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { WALLETS } from "../lib/constants";

export function StyledConnectButton(
  props?: Omit<ConnectButtonProps, "client" | "theme">,
) {
  const { theme } = useTheme();

  return (
    <ConnectButton
      chains={[
        sepolia,
        baseSepolia,
        optimismSepolia,
        polygonAmoy,
        arbitrumSepolia,
        abstract,
        apechain,
        base,
        ethereum,
        polygon,
        optimism,
        arbitrum,
      ]}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      wallets={WALLETS}
      {...props}
    />
  );
}
