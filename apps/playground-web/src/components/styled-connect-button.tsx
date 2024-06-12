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
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
