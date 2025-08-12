"use client";

import { ZapIcon } from "lucide-react";
import Link from "next/link";
import { reportTokenUpsellClicked } from "@/analytics/report";
import { GridPattern } from "@/components/ui/background-patterns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TokensSection() {
  return (
    <div className="bg-card p-4 lg:py-8 lg:px-6 border rounded-xl relative w-full overflow-hidden">
      <GridPattern
        width={30}
        height={30}
        strokeDasharray={"4 2"}
        className="text-border dark:text-border/70 hidden lg:block translate-x-5"
        style={{
          maskImage:
            "linear-gradient(to bottom left,white,transparent,transparent)",
        }}
      />

      <Badge
        variant="outline"
        className="text-sm bg-background h-auto px-3 py-1 gap-2 mb-4"
      >
        <div className="rounded-full bg-primary size-2" />
        New
      </Badge>

      <h2 className="font-semibold text-2xl tracking-tight mb-1">
        Launch Your Tokens Effortlessly
      </h2>
      <p className="text-muted-foreground mb-6 text-sm lg:text-base">
        Deploy contract and configure all settings you need to launch your token
        in one seamless flow
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <CardLink
          assetType="coin"
          title="Launch Coin"
          description="Launch an ERC-20 token to create a cryptocurrency"
          href="/team/~/~project/tokens/create/token"
          bullets={[
            "Deploy Contract",
            "Configure Price and Supply",
            "Airdrop Tokens",
          ]}
        />

        <CardLink
          assetType="nft"
          title="Launch NFT Collection"
          description="Launch an ERC-721 or ERC-1155 NFT collection"
          href="/team/~/~project/tokens/create/nft"
          bullets={[
            "Deploy Contract",
            "Upload NFTs",
            "Configure Price and Supply",
          ]}
        />
      </div>
    </div>
  );
}

function CardLink(props: {
  title: string;
  description: string;
  href: string;
  assetType: "nft" | "coin";
  bullets: string[];
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border p-4 cursor-pointer hover:border-active-border bg-background",
      )}
    >
      <div className="mb-3 flex">
        <div className="flex items-center justify-center rounded-full border p-2 bg-card">
          <ZapIcon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        <Link
          className="before:absolute before:inset-0"
          href={props.href}
          onClick={() => {
            reportTokenUpsellClicked({
              assetType: props.assetType,
              pageType: "explore",
            });
          }}
        >
          {props.title}
        </Link>
      </h3>
      <p className="text-muted-foreground text-sm">{props.description}</p>

      <ul className="mt-4 space-y-1 text-sm list-disc list-inside text-muted-foreground">
        {props.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}
