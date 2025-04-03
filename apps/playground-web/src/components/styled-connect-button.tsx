"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import {
  abstract,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import type { ConnectButtonProps } from "thirdweb/react";
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
      wallets={WALLETS}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
