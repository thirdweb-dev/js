"use client";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectEmbed, useActiveAccount } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

export default function Page() {
  const { theme } = useTheme();

  return (
    <ConnectEmbed
      theme={theme as "light" | "dark"}
      autoConnect={true}
      wallets={[inAppWallet()]}
      client={client}
    />
  );
}
