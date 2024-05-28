"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";

export function StyledPayEmbed() {
  const { theme } = useTheme();

  return (
    <PayEmbed
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "dark" : "light"}
    />
  );
}
