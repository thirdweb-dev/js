"use client";
import type { ConnectButtonProps } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { StyledConnectEmbed } from "../styled-connect-embed";

const getEcosystemWallet = () => {
  if (
    process.env.NEXT_PUBLIC_IN_APP_WALLET_URL?.endsWith(".thirdweb-dev.com")
  ) {
    // dev ecosystem
    return ecosystemWallet("ecosystem.catfans");
  }
  // prod ecosystem
  return ecosystemWallet("ecosystem.thirdweb-engs", {
    partnerId: "50fd8850-3c6c-48dd-969c-622f88b52d95",
  });
};

export function EcosystemConnectEmbed(
  props?: Omit<ConnectButtonProps, "client" | "theme">,
) {
  return (
    <StyledConnectEmbed
      {...props}
      wallets={[getEcosystemWallet()]}
      onConnect={(activeWallet, allConnectedWallets) => {
        console.log("active wallet", activeWallet.id);
        console.log(
          "all connected wallets",
          allConnectedWallets.map((wallet) => wallet.id),
        );
      }}
    />
  );
}
