"use client";

import { thirdwebClient } from "@/constants/client";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { defineChain } from "thirdweb";
import { PayEmbed } from "thirdweb/react";

export function CustomPayEmbed(props: { chainId: number }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const chain = useMemo(() => defineChain(props.chainId), [props.chainId]);
  return (
    <PayEmbed
      client={thirdwebClient}
      connectOptions={{ chain }}
      theme={theme}
      payOptions={{
        prefillBuy: {
          chain,
          allowEdits: { chain: false, amount: true, token: true },
        },
      }}
    />
  );
}
