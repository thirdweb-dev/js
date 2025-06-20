"use client";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import {
  defineChain,
  getAddress,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebClient,
  toTokens,
} from "thirdweb";
import {
  Blobbie,
  TokenIcon,
  TokenProvider,
  useActiveAccount,
  useActiveWalletChain,
} from "thirdweb/react";
import { getWalletBalance } from "thirdweb/wallets";
import { ChainIconClient } from "@/components/blocks/ChainIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { isProd } from "@/constants/env-utils";
import { nebulaAppThirdwebClient } from "@/constants/nebula-client";
import { useAllChainsData } from "@/hooks/chains";

export type AssetBalance = {
  chain_id: number;
  token_address: string;
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
};

export function AssetsSectionUI(props: {
  data: AssetBalance[];
  isPending: boolean;
  client: ThirdwebClient;
}) {
  if (props.data.length === 0 && !props.isPending) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-2 py-1">
        <div className="rounded-full border p-1">
          <XIcon className="size-4" />
        </div>
        <div className="text-muted-foreground text-sm">No Assets </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {!props.isPending &&
        props.data.map((asset) => (
          <AssetItem
            asset={asset}
            client={props.client}
            key={`${asset.chain_id}-${asset.token_address}`}
          />
        ))}

      {props.isPending &&
        new Array(10).fill(null).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: for the placeholder this is explicitly the key
          <SkeletonAssetItem key={index} />
        ))}
    </div>
  );
}

function SkeletonAssetItem() {
  return (
    <div className="flex h-[48px] items-center gap-2 px-2 py-1">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-32 bg-muted" />
        <Skeleton className="h-3 w-24 bg-muted" />
      </div>
    </div>
  );
}

function AssetItem(props: { asset: AssetBalance; client: ThirdwebClient }) {
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(props.asset.chain_id);
  const isNativeToken = props.asset.token_address === NATIVE_TOKEN_ADDRESS;

  return (
    <TokenProvider
      address={props.asset.token_address}
      chain={defineChain(props.asset.chain_id)}
      // eslint-disable-next-line no-restricted-syntax
      client={props.client}
    >
      <div className="relative flex h-[48px] items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-accent">
        <div className="relative">
          <TokenIcon
            className="size-8 rounded-full border"
            fallbackComponent={
              <Blobbie
                address={props.asset.token_address}
                className="size-8 rounded-full"
              />
            }
            loadingComponent={
              <Blobbie
                address={props.asset.token_address}
                className="size-8 rounded-full"
              />
            }
          />
          {!isNativeToken && (
            <div className="-right-0.5 -bottom-0.5 absolute rounded-full border bg-background p-0.5">
              <ChainIconClient
                className="size-3.5"
                client={props.client}
                src={chainMeta?.icon?.url || ""}
              />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col text-sm">
          <Link
            className="truncate font-medium before:absolute before:inset-0"
            href={
              isNativeToken
                ? `https://thirdweb.com/${props.asset.chain_id}`
                : `https://thirdweb.com/${props.asset.chain_id}/${props.asset.token_address}`
            }
            target="_blank"
          >
            {props.asset.name}
          </Link>

          <p className="truncate text-muted-foreground text-sm">
            {`${toTokens(BigInt(props.asset.balance), props.asset.decimals)} ${props.asset.symbol}`}
          </p>
        </div>
      </div>
    </TokenProvider>
  );
}

export function AssetsSection(props: { client: ThirdwebClient }) {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const assetsQuery = useQuery({
    enabled: !!account && !!activeChain,
    queryFn: async () => {
      if (!account || !activeChain) {
        return [];
      }
      const chains = [...new Set([1, 8453, 10, 137, activeChain.id])];
      const url = new URL(
        `https://insight.${isProd ? "thirdweb" : "thirdweb-dev"}.com/v1/tokens/erc20/${account?.address}`,
      );
      url.searchParams.set("limit", "50");
      url.searchParams.set("metadata", "true");
      url.searchParams.set("include_spam", "false");
      url.searchParams.set("clientId", nebulaAppThirdwebClient.clientId);
      for (const chain of chains) {
        url.searchParams.append("chain", chain.toString());
      }

      const response = await fetch(url.toString());
      const json = (await response.json()) as {
        data: AssetBalance[];
      };

      const tokensToShowOnTop = new Set(
        [
          // base
          "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // usdc,
          "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c", // wbtc
          "0x4200000000000000000000000000000000000006", // wrapped eth
          // ethereum
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // usdc
          "0xdac17f958d2ee523a2206206994597c13d831ec7", // usdt
          "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", // bnb
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // weth
          "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // wbtc
          // optimism
          "0x4200000000000000000000000000000000000042", // op token
          "0xdc6ff44d5d932cbd77b52e5612ba0529dc6226f1", // world coin
          "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58", // usdt
          "0x0b2c639c533813f4aa9d7837caf62653d097ff85", // usdc
          "0x4200000000000000000000000000000000000006", // wrapped eth
          // polygon
          "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // weth
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // usdt
          "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3", // bnb
          "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // usdc
          "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // usdc.e
        ].map((x) => getAddress(x)),
      );

      return json.data.sort((a, b) => {
        if (tokensToShowOnTop.has(getAddress(a.token_address))) {
          return -1;
        }
        if (tokensToShowOnTop.has(getAddress(b.token_address))) {
          return 1;
        }
        return 0;
      });
    },
    queryKey: ["v1/tokens/erc20", account?.address, activeChain?.id],
  });

  const nativeBalances = useQuery({
    queryFn: async () => {
      if (!account || !activeChain) {
        return [];
      }

      const chains = [...new Set([1, 8453, 10, 137, activeChain.id])];

      const result = await Promise.allSettled(
        chains.map((chain) =>
          getWalletBalance({
            address: account.address,
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(chain),
            client: props.client,
          }),
        ),
      );

      return result
        .filter((r) => r.status === "fulfilled")
        .map((r) => ({
          balance: r.value.value.toString(),
          chain_id: r.value.chainId,
          decimals: r.value.decimals,
          name: r.value.name,
          symbol: r.value.symbol,
          token_address: r.value.tokenAddress,
        }))
        .filter((x) => x.balance !== "0") as AssetBalance[];
    },
    queryKey: ["getWalletBalance", account?.address, activeChain?.id],
  });

  const isPending = assetsQuery.isPending || nativeBalances.isPending;

  const data = [...(nativeBalances.data ?? []), ...(assetsQuery.data ?? [])];

  return (
    <AssetsSectionUI client={props.client} data={data} isPending={isPending} />
  );
}
