"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  sepolia,
} from "thirdweb/chains";
import {
  ConnectEmbed,
  type ConnectEmbedProps,
  useActiveAccount,
} from "thirdweb/react";
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
        sepolia,
        baseSepolia,
        optimismSepolia,
        polygonAmoy,
        arbitrumSepolia,
      ]}
      wallets={WALLETS}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
