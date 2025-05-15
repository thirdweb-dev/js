import { Skeleton } from "@/components/ui/skeleton";
import { isProd } from "@/constants/env-utils";
import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { type ThirdwebClient, defineChain, toTokens } from "thirdweb";
import {
  Blobbie,
  TokenIcon,
  TokenProvider,
  useActiveAccount,
  useActiveWalletChain,
} from "thirdweb/react";
import { ChainIconClient } from "../../../../../components/icons/ChainIcon";
import { useAllChainsData } from "../../../../../hooks/chains/allChains";
import { nebulaAppThirdwebClient } from "../../utils/nebulaThirdwebClient";

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
            key={asset.token_address}
            asset={asset}
            client={props.client}
          />
        ))}

      {props.isPending &&
        new Array(10).fill(null).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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

function AssetItem(props: {
  asset: AssetBalance;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(props.asset.chain_id);
  return (
    <TokenProvider
      address={props.asset.token_address}
      client={props.client}
      // eslint-disable-next-line no-restricted-syntax
      chain={defineChain(props.asset.chain_id)}
    >
      <div className="relative flex h-[48px] items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-accent">
        <div className="relative">
          <TokenIcon
            className="size-8 rounded-full"
            loadingComponent={
              <Blobbie
                address={props.asset.token_address}
                className="size-8 rounded-full"
              />
            }
            fallbackComponent={
              <Blobbie
                address={props.asset.token_address}
                className="size-8 rounded-full"
              />
            }
          />
          <div className="-right-0.5 -bottom-0.5 absolute rounded-full border bg-background p-0.5">
            <ChainIconClient
              client={props.client}
              className="size-3.5"
              src={chainMeta?.icon?.url || ""}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col text-sm">
          <Link
            href={`https://thirdweb.com/${props.asset.chain_id}/${props.asset.token_address}`}
            target="_blank"
            className="truncate font-medium before:absolute before:inset-0"
          >
            {props.asset.name}
          </Link>

          <p className="text-muted-foreground text-sm">
            {`${toTokens(BigInt(props.asset.balance), props.asset.decimals)} ${props.asset.symbol}`}
          </p>
        </div>
      </div>
    </TokenProvider>
  );
}

export function AssetsSection(props: {
  client: ThirdwebClient;
}) {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const assetsQuery = useQuery({
    queryKey: ["v1/tokens/erc20", account?.address, activeChain?.id],
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

      return json.data;
    },
    enabled: !!account && !!activeChain,
  });

  return (
    <AssetsSectionUI
      data={assetsQuery.data ?? []}
      isPending={assetsQuery.isPending}
      client={props.client}
    />
  );
}
