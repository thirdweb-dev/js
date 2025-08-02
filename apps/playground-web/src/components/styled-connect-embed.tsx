"use client";

import { useTheme } from "next-themes";
import {
  abstract,
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
import {
  ConnectEmbed,
  type ConnectEmbedProps,
  useActiveAccount,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { WALLETS } from "../lib/constants";
import { StyledConnectButton } from "./styled-connect-button";

export function StyledConnectEmbed(
  props?: Omit<ConnectEmbedProps, "client" | "theme">,
) {
  const { theme } = useTheme();
  const account = useActiveAccount();

  return account ? (
    <div className="flex flex-col gap-8">
      <StyledConnectButton {...props} />
    </div>
  ) : (
    <ConnectEmbed
      chains={[
        base,
        ethereum,
        polygon,
        optimism,
        arbitrum,
        sepolia,
        baseSepolia,
        optimismSepolia,
        polygonAmoy,
        arbitrumSepolia,
        abstract,
      ]}
      client={THIRDWEB_CLIENT}
      className="!max-w-full"
      theme={theme === "light" ? "light" : "dark"}
      wallets={WALLETS}
      {...props}
    />
  );
}
