"use client";
import { useTheme } from "next-themes";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";
import { ecosystemWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

export default function ConnectButton({
  ecosystem,
}: {
  ecosystem: `ecosystem.${string}`;
}) {
  const { theme } = useTheme();

  return (
    <ThirdwebConnectButton
      client={client}
      theme={theme === "light" ? "light" : "dark"}
      wallets={[ecosystemWallet(ecosystem)]}
    />
  );
}
