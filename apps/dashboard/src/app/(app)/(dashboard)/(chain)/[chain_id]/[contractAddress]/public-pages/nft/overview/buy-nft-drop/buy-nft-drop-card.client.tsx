"use client";

import { useDashboardRouter } from "@/lib/DashboardRouter";
import { BuyNFTDrop, type BuyNFTDropProps } from "./buy-nft-drop.client";

export function BuyNFTDropCardClient(
  props: Omit<BuyNFTDropProps, "onSuccess">,
) {
  const router = useDashboardRouter();

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 font-semibold text-lg tracking-tight">Buy NFTs</h2>
      <BuyNFTDrop {...props} onSuccess={() => router.refresh()} />
    </div>
  );
}
