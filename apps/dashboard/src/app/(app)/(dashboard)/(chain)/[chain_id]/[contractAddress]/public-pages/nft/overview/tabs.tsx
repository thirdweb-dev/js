"use client";

import { TabButtons } from "@/components/ui/tabs";
import { useState } from "react";

export function NFTPublicPageTabs(props: {
  nftsPage: React.ReactNode;
  buyPage: React.ReactNode;
}) {
  const [tab, setTab] = useState<"nfts" | "buy">("nfts");

  return (
    <div className="space-y-2">
      {props.buyPage && (
        <TabButtons
          tabs={[
            {
              name: "NFTs",
              onClick: () => setTab("nfts"),
              isActive: tab === "nfts",
            },
            {
              name: "Buy NFTs",
              onClick: () => setTab("buy"),
              isActive: tab === "buy",
            },
          ]}
        />
      )}

      {tab === "nfts" && props.nftsPage}
      {tab === "buy" && props.buyPage}
    </div>
  );
}
