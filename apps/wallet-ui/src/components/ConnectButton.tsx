"use client";
import { client } from "@/lib/client";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";

export default function ConnectButton() {
  return <ThirdwebConnectButton client={client} />;
}
