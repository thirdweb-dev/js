"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import type { ConnectButtonProps } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { chain } from "./constants";

export function InAppConnectButton(
  props?: Omit<ConnectButtonProps, "client" | "theme">,
) {
  const { theme } = useTheme();

  return (
    <ConnectButton
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      connectButton={{
        label: "Sign in",
      }}
      wallets={[
        inAppWallet({
          smartAccount: {
            chain,
            sponsorGas: true,
          },
        }),
      ]}
      {...props}
    />
  );
}
