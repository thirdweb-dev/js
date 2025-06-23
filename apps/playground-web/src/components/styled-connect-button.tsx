"use client";

import { useTheme } from "next-themes";
import {
  abstract,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
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
      ]}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      wallets={WALLETS}
      {...props}
    />
  );
}
