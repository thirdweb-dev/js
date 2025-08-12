"use client";
import { reportAssetPageview } from "@/analytics/report";
import { useEffectOnce } from "@/hooks/useEffectOnce";

export function AssetPageView(props: {
  assetType: "nft" | "coin";
  chainId: number;
}) {
  useEffectOnce(() => {
    reportAssetPageview({
      assetType: props.assetType,
      chainId: props.chainId,
    });
  });

  return null;
}
