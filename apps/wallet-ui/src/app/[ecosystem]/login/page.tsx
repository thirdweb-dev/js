"use client";
import { client } from "@/lib/client";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

export default function Page() {
  return (
    <ConnectEmbed
      autoConnect={true}
      wallets={[inAppWallet()]}
      client={client}
    />
  );
}
