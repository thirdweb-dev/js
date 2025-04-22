"use client";

// don't know why - but getting compilation error without adding "use client" even though it's already added
// where we import AutoConnect from in thirdweb/react

import { useThirdwebClient } from "@/constants/thirdweb.client";
import { AutoConnect } from "thirdweb/react";
import type { SmartWalletOptions } from "thirdweb/wallets";

export function TWAutoConnect(props: {
  accountAbstraction?: SmartWalletOptions;
}) {
  const client = useThirdwebClient();
  return (
    <AutoConnect
      client={client}
      accountAbstraction={props.accountAbstraction}
    />
  );
}
