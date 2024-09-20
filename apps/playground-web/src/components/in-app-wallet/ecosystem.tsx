"use client";
import type { ConnectButtonProps } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { StyledConnectEmbed } from "../styled-connect-embed";

const getEcosystem = () => {
  if (
    process.env.NEXT_PUBLIC_IN_APP_WALLET_URL?.endsWith(".thirdweb-dev.com")
  ) {
    // dev ecosystem
    return "ecosystem.bonfire-development";
  }
  // prod ecosystem
  return "ecosystem.new-age";
};

export function EcosystemConnectEmbed(
  props?: Omit<ConnectButtonProps, "client" | "theme">,
) {
  return (
    <StyledConnectEmbed
      {...props}
      wallets={[ecosystemWallet(getEcosystem())]}
    />
  );
}
