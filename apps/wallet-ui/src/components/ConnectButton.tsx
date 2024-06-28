"use client";
import { client } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";

export default function ConnectButton() {
  const { theme } = useTheme();

  return (
    <ThirdwebConnectButton client={client} theme={theme as "light" | "dark"} />
  );
}
