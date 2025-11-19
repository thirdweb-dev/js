"use client";

import { RocketIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { reportTokenUpsellClicked } from "@/analytics/report";
import { Img } from "@/components/blocks/Img";
import { Button } from "@/components/ui/button";

const thirdwebEns = {
  name: "thirdweb.eth",
  image: "https://euc.li/thirdweb.eth",
};

function TokenContractCard(props: {
  name: string;
  description: string;
  link: string;
  trackingType: "nft" | "coin";
}) {
  return (
    <article className="relative flex min-h-[220px] flex-col rounded-lg border border-border bg-card p-4 hover:border-active-border">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 font-medium text-sm text-success-text">
          <ShieldCheckIcon className="size-4" />
          Audited
        </div>
      </div>

      <div className="h-3.5" />

      {/* Title */}
      <h3 className="font-semibold text-lg tracking-tight">
        <Link
          className="cursor-pointer before:absolute before:inset-0 before:z-0"
          href={props.link}
          onClick={() => {
            reportTokenUpsellClicked({
              assetType: props.trackingType,
              pageType: "explore",
            });
          }}
        >
          {props.name}
        </Link>
      </h3>

      <p className="mt-1 text-muted-foreground text-sm leading-5">
        {props.description}
      </p>

      <div className="mt-auto relative z-1 flex justify-between gap-2 pt-3">
        <Link
          className="flex shrink-0 items-center gap-1.5 hover:underline"
          href={`/${thirdwebEns.name}`}
          target="_blank"
        >
          <Img
            className="size-5 rounded-full object-cover"
            src={thirdwebEns.image}
          />

          <span className="text-xs"> {thirdwebEns.name}</span>
        </Link>

        <div className="flex items-center justify-between">
          <Button
            asChild
            className="relative z-10 h-auto gap-1.5 px-2.5 py-1.5 text-xs hover:bg-inverted hover:text-inverted-foreground"
            size="sm"
            variant="outline"
          >
            <Link href={props.link}>
              <RocketIcon className="size-3" />
              Deploy
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function NFTCollectionCard() {
  return (
    <TokenContractCard
      name="NFT Collection"
      description="Launch an ERC-721 or ERC-1155 NFT collection"
      link="/team/~/~project/tokens/create/nft"
      trackingType="nft"
    />
  );
}

export function CoinCard() {
  return (
    <TokenContractCard
      name="Coin"
      description="Launch an ERC-20 token to create a cryptocurrency"
      link="/team/~/~project/tokens/create/token"
      trackingType="coin"
    />
  );
}
