"use client";
import { reportAssetPageview } from "@/analytics/report";
import { useEffectOnce } from "@/hooks/useEffectOnce";

export function AssetPageView(props: {
  assetType: "nft" | "coin";
  chainId: number;
  is_testnet: boolean;
}) {
  useEffectOnce(() => {
    reportAssetPageview({
      assetType: props.assetType,
      chainId: props.chainId,
      is_testnet: props.is_testnet,
    });
  });

  return null;
}
