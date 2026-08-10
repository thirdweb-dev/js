"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bridge } from "thirdweb";
import {
  arbitrum,
  base,
  ethereum,
  optimism,
  polygon,
} from "thirdweb/chains";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CodeExample } from "../code/code-example";

const CHAINS = [
  { chain: ethereum, label: "Ethereum", id: 1 },
  { chain: base, label: "Base", id: 8453 },
  { chain: polygon, label: "Polygon", id: 137 },
  { chain: arbitrum, label: "Arbitrum", id: 42161 },
  { chain: optimism, label: "Optimism", id: 10 },
] as const;

function formatUsd(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

function formatPrice(value: number): string {
  if (value >= 1) {
    return `$${value.toFixed(2)}`;
  }
  if (value >= 0.01) {
    return `$${value.toFixed(4)}`;
  }
  return `$${value.toFixed(6)}`;
}

function TokenPriceTrackerPreview() {
  const [selectedChainId, setSelectedChainId] = useState(1);

  const tokensQuery = useQuery({
    queryKey: ["bridge-tokens-price", selectedChainId],
    queryFn: () =>
      Bridge.tokens({
        client: THIRDWEB_CLIENT,
        chainId: selectedChainId,
        limit: 15,
        sortBy: "market_cap",
        includePrices: true,
      }),
    refetchInterval: 30_000,
  });

  return (
    <div className="w-full max-w-3xl space-y-4 px-4">
      {/* Chain Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {CHAINS.map((c) => (
          <Button
            key={c.id}
            type="button"
            variant={selectedChainId === c.id ? "default" : "outline"}
            size="sm"
            aria-pressed={selectedChainId === c.id}
            onClick={() => setSelectedChainId(c.id)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              selectedChainId !== c.id &&
                "text-muted-foreground",
            )}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {/* Token List */}
      <div className="rounded-lg border bg-card">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-4 py-2.5 text-xs font-medium text-muted-foreground">
          <span>Token</span>
          <span className="w-24 text-right">Price</span>
          <span className="hidden w-24 text-right sm:block">Market Cap</span>
          <span className="hidden w-24 text-right sm:block">24h Volume</span>
        </div>

        {/* Loading State */}
        {tokensQuery.isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i.toString()}`}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-4 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 animate-pulse rounded-full bg-muted" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  </div>
                </div>
                <div className="h-4 w-24 animate-pulse self-center rounded bg-muted" />
                <div className="hidden h-4 w-24 animate-pulse self-center rounded bg-muted sm:block" />
                <div className="hidden h-4 w-24 animate-pulse self-center rounded bg-muted sm:block" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {tokensQuery.isError && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Failed to load token data. Please try again.
          </div>
        )}

        {/* Data */}
        {tokensQuery.data?.map((token) => (
          <div
            key={`${token.chainId}-${token.address}`}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b px-4 py-3 last:border-b-0 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {token.iconUri ? (
                <img
                  src={token.iconUri}
                  alt={token.name}
                  className="size-8 rounded-full"
                />
              ) : (
                <div className="size-8 rounded-full bg-muted" />
              )}
              <div>
                <p className="text-sm font-medium leading-tight">
                  {token.name}
                </p>
                <p className="text-xs text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
            <span className="w-24 self-center text-right text-sm font-medium tabular-nums">
              {token.prices?.USD ? formatPrice(token.prices.USD) : "—"}
            </span>
            <span className="hidden w-24 self-center text-right text-xs text-muted-foreground tabular-nums sm:block">
              {token.marketCapUsd ? formatUsd(token.marketCapUsd) : "—"}
            </span>
            <span className="hidden w-24 self-center text-right text-xs text-muted-foreground tabular-nums sm:block">
              {token.volume24hUsd ? formatUsd(token.volume24hUsd) : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <p className="text-center text-xs text-muted-foreground">
        Auto-refreshes every 30s
        {tokensQuery.isFetching && !tokensQuery.isLoading && (
          <span className="ml-1.5 inline-block size-2 animate-pulse rounded-full bg-green-500" />
        )}
      </p>
    </div>
  );
}

export function TokenPriceTracker({ className }: { className?: string }) {
  return (
    <div className={cn(className)}>
    <CodeExample
      header={{
        title: "Token Price Tracker",
        description:
          "Fetch live token prices, market cap, and 24h volume using the Bridge.tokens() API with multi-chain support and auto-refresh.",
      }}
      code={`import { Bridge } from "thirdweb";
import { useQuery } from "@tanstack/react-query";

function App() {
  const { data: tokens } = useQuery({
    queryKey: ["tokens", chainId],
    queryFn: () =>
      Bridge.tokens({
        client: THIRDWEB_CLIENT,
        chainId: 1, // Ethereum
        limit: 15,
        sortBy: "market_cap",
        includePrices: true,
      }),
    refetchInterval: 30_000, // auto-refresh every 30s
  });

  return tokens?.map((token) => (
    <div key={token.address}>
      <img src={token.iconUri} alt={token.name} />
      <span>{token.name} ({token.symbol})</span>
      <span>\${token.prices?.USD?.toFixed(2)}</span>
      <span>MCap: {token.marketCapUsd}</span>
      <span>Vol: {token.volume24hUsd}</span>
    </div>
  ));
}`}
      lang="tsx"
      preview={<TokenPriceTrackerPreview />}
    />
    </div>
  );
}
