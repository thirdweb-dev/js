"use client";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { AutoConnect } from "thirdweb/react";
import type { SmartWalletOptions } from "thirdweb/wallets";

const client = getClientThirdwebClient();

export function TWAutoConnect(props: {
  accountAbstraction?: SmartWalletOptions;
}) {
  return (
    <AutoConnect
      client={client}
      accountAbstraction={props.accountAbstraction}
    />
  );
}
