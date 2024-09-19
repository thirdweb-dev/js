"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";

export function StyledPayEmbedPreview() {
  const { theme } = useTheme();

  return (
    <PayEmbed
      client={THIRDWEB_CLIENT}
      payOptions={{
        buyWithFiat: {
          preferredProvider: "STRIPE",
        },
      }}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}
