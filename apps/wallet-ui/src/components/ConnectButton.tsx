"use client";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";

export default function ConnectButton({
  ecosystem,
}: { ecosystem: `ecosystem.${string}` }) {
  const { theme } = useTheme();

  return (
    <ThirdwebConnectButton
      wallets={[ecosystemWallet(ecosystem)]}
      client={client}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}
