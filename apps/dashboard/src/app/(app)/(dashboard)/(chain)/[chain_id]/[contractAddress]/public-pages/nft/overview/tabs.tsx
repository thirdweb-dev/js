"use client";

import { useState } from "react";
import { TabButtons } from "@/components/ui/tabs";

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
              isActive: tab === "nfts",
              name: "NFTs",
              onClick: () => setTab("nfts"),
            },
            {
              isActive: tab === "buy",
              name: "Buy NFTs",
              onClick: () => setTab("buy"),
            },
          ]}
        />
      )}

      {tab === "nfts" && props.nftsPage}
      {tab === "buy" && props.buyPage}
    </div>
  );
}
