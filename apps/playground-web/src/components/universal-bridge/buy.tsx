"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { useTheme } from "next-themes";
import { NATIVE_TOKEN_ADDRESS, toWei } from "thirdweb";
import { arbitrum } from "thirdweb/chains";
import { BuyWidget } from "thirdweb/react";

export function StyledBuyWidgetPreview() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-10" />
      <BuyWidget
        client={THIRDWEB_CLIENT}
        theme={theme === "light" ? "light" : "dark"}
        title="Get Funds"
        tokenAddress={NATIVE_TOKEN_ADDRESS}
        chain={arbitrum}
        amount={toWei("0.002")}
      />
    </div>
  );
}
