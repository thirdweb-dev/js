"use client";

import { useTheme } from "next-themes";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { arbitrum } from "thirdweb/chains";
import { BuyWidget } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";

export function StyledBuyWidgetPreview() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-10" />
      <BuyWidget
        amount={"0.1"}
        chain={arbitrum}
        client={THIRDWEB_CLIENT}
        theme={theme === "light" ? "light" : "dark"}
        title="Get Funds"
        tokenAddress={NATIVE_TOKEN_ADDRESS}
      />
    </div>
  );
}
