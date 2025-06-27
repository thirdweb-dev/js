"use client";

import { useTheme } from "next-themes";
import type { Chain, ThirdwebClient } from "thirdweb";
import { BuyWidget } from "thirdweb/react";
import {
  reportAssetBuyFailed,
  reportAssetBuySuccessful,
} from "@/analytics/report";
import { parseError } from "@/utils/errorParser";
import { getSDKTheme } from "@/utils/sdk-component-theme";

export function BuyTokenEmbed(props: {
  client: ThirdwebClient;
  chain: Chain;
  tokenAddress: string;
}) {
  const { theme } = useTheme();
  return (
    <BuyWidget
      amount="1"
      chain={props.chain}
      className="!rounded-xl !w-full"
      client={props.client}
      connectOptions={{
        autoConnect: false,
      }}
      onError={(e) => {
        const errorMessage = parseError(e);
        reportAssetBuyFailed({
          assetType: "coin",
          chainId: props.chain.id,
          contractType: "DropERC20",
          error: errorMessage,
        });
      }}
      onSuccess={() => {
        reportAssetBuySuccessful({
          assetType: "coin",
          chainId: props.chain.id,
          contractType: "DropERC20",
        });
      }}
      theme={getSDKTheme(theme === "light" ? "light" : "dark")}
      tokenAddress={props.tokenAddress as `0x${string}`}
    />
  );
}
