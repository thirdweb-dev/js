"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import type { ConnectButtonProps } from "thirdweb/react";

export function StyledConnectButton(
  props?: Omit<ConnectButtonProps, "client" | "theme">,
) {
  const { theme } = useTheme();

  return (
    <ConnectButton
      supportedNFTs={{
        "84532": ["0x638263e3eAa3917a53630e61B1fBa685308024fa"],
      }}
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
