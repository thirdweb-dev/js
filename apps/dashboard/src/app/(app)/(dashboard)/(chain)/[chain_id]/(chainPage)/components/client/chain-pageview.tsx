"use client";
import { reportChainPageview } from "@/analytics/report";
import { useEffectOnce } from "@/hooks/useEffectOnce";

export function ChainPageView(props: { chainId: number; is_testnet: boolean }) {
  useEffectOnce(() => {
    reportChainPageview({
      chainId: props.chainId,
      is_testnet: props.is_testnet,
    });
  });

  return null;
}
