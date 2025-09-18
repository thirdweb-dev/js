"use client";
import { reportChainPageview } from "@/analytics/report";
import { useEffectOnce } from "@/hooks/useEffectOnce";

export function ChainPageView(props: { chainId: number }) {
  useEffectOnce(() => {
    reportChainPageview({
      chainId: props.chainId,
    });
  });

  return null;
}
