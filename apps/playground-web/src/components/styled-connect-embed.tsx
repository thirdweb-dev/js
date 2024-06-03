"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectEmbed, type ConnectEmbedProps } from "thirdweb/react";

export function StyledConnectEmbed(
  props?: Omit<ConnectEmbedProps, "client" | "theme">,
) {
  const { theme } = useTheme();

  return (
    <ConnectEmbed
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
      {...props}
    />
  );
}
