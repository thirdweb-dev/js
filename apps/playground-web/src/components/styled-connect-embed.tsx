"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { ConnectEmbed } from "thirdweb/react";

export function StyledConnectEmbed() {
  const { theme } = useTheme();

  return (
    <ConnectEmbed
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}
