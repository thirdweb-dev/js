"use client";
import type { ThirdwebClient } from "thirdweb";
import { AutoConnect } from "thirdweb/react";
import type { SmartWalletOptions } from "thirdweb/wallets";

export function TWAutoConnect(props: {
  accountAbstraction?: SmartWalletOptions;
  client: ThirdwebClient;
}) {
  return (
    <AutoConnect
      accountAbstraction={props.accountAbstraction}
      client={props.client}
    />
  );
}
