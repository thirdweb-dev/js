"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { PayEmbed } from "thirdweb/react";

import { setThirdwebDomains } from "thirdweb/utils";

setThirdwebDomains({
  pay: 'pay.thirdweb-dev.com',
  rpc: 'rpc.thirdweb-dev.com',
  inAppWallet: 'embedded-wallet.thirdweb-dev.com',
});


export function StyledPayEmbedPreview() {
  const { theme } = useTheme();

  return (
    <PayEmbed
      client={THIRDWEB_CLIENT}
      theme={theme === "light" ? "light" : "dark"}
    />
  );
}
