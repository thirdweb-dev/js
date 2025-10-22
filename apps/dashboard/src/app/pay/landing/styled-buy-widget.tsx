"use client";

import { useTheme } from "next-themes";
import { BuyWidget, type BuyWidgetProps } from "thirdweb/react";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getSDKTheme } from "@/utils/sdk-component-theme";
import { payLandingWallets } from "./wallets";

const client = getClientThirdwebClient();

export function StyledBuyWidget(
  props: Omit<BuyWidgetProps, "client" | "theme">,
) {
  const { theme } = useTheme();

  return (
    <BuyWidget
      {...props}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
      client={client}
      className="shadow-xl"
      connectOptions={{
        wallets: payLandingWallets,
      }}
    />
  );
}
