"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { reportTokenUpsellClicked } from "@/analytics/report";
import { DismissibleAlert } from "@/components/blocks/dismissible-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TokenBanner(props: { type: "erc20" | "erc721" | "erc1155" }) {
  const title =
    props.type === "erc20"
      ? "Launch Your Token Effortlessly"
      : "Launch Your NFT Collection Effortlessly";
  const description =
    props.type === "erc20"
      ? "Deploy contract, set price and supply, airdrop tokens all in one seamless flow"
      : props.type === "erc721"
        ? "Deploy contract, upload NFTs, set price all in one seamless flow"
        : "Deploy contract, upload NFTs, set prices and supply all in one seamless flow";
  const href =
    props.type === "erc20"
      ? "/team/~/~project/tokens/create/token"
      : "/team/~/~project/tokens/create/nft";

  return (
    <DismissibleAlert
      header={
        <Badge
          variant="outline"
          className="bg-background gap-1.5 py-1 px-2.5 h-auto mb-3"
        >
          <div className="rounded-full bg-primary size-1.5" />
          New
        </Badge>
      }
      title={title}
      className="container max-w-5xl mt-8"
      preserveState={false}
      description={description}
    >
      <Button
        variant="default"
        size="sm"
        className="gap-2 rounded-full mt-4 px-6"
        asChild
      >
        <Link
          href={href}
          target="_blank"
          onClick={() => {
            reportTokenUpsellClicked({
              assetType: props.type === "erc20" ? "coin" : "nft",
              pageType: "deploy-contract",
            });
          }}
        >
          Try Now <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </Button>
    </DismissibleAlert>
  );
}
