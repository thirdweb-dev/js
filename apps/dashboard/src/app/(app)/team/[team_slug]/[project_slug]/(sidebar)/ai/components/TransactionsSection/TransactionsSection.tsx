import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebClient } from "thirdweb";
import { useActiveAccount, useActiveWalletChain } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { isProd } from "@/constants/env-utils";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { ChainIconClient } from "@/icons/ChainIcon";

// Note: this is not the full object type returned from insight API, it only includes fields we care about
export type WalletTransaction = {
  chain_id: string;
  value: string;
  hash: string;
  from_address: string;
  to_address: string;
  decoded?: {
    name: string;
    signature: string;
    inputs: null | object;
  };
};

export function TransactionSectionUI(props: {
  data: WalletTransaction[];
  isPending: boolean;
  client: ThirdwebClient;
}) {
  if (props.data.length === 0 && !props.isPending) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-2 py-1">
        <div className="rounded-full border p-1">
          <XIcon className="size-4" />
        </div>
        <div className="text-muted-foreground text-sm">No Recent Activity</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {!props.isPending &&
        props.data.map((asset) => (
          <TransactionInfo
            client={props.client}
            key={asset.hash}
            transaction={asset}
          />
        ))}

      {props.isPending &&
        new Array(10).fill(null).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: TODO
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

function TransactionInfo(props: {
  transaction: WalletTransaction;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const chainMeta = idToChain.get(Number(props.transaction.chain_id));
  const title = getTransactionTitle(props.transaction);
  const description = getTransactionDescription(props.transaction);
  const explorer =
    chainMeta?.explorers?.[0]?.url ||
    `https://thirdweb.com/${props.transaction.chain_id}`;

  return (
    <div className="relative flex h-[48px] items-center gap-2.5 rounded-lg px-2 py-1 hover:bg-accent">
      <ChainIconClient
        className="size-8 rounded-full border"
        client={props.client}
        src={chainMeta?.icon?.url || ""}
      />

      <div className="flex min-w-0 flex-col text-sm">
        <Link
          className="truncate font-medium capitalize before:absolute before:inset-0"
          href={`${explorer}/tx/${props.transaction.hash}`}
          target="_blank"
        >
          {title}
        </Link>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

function getTransactionTitle(transaction: WalletTransaction) {
  if (!transaction.decoded) {
    return "Transaction Sent";
  }

  if (transaction.decoded.name) {
    return transaction.decoded.name;
  }

  if (transaction.decoded.signature) {
    const nameFromSignature = transaction.decoded.signature.split("(")[0];
    if (nameFromSignature) {
      return nameFromSignature;
    }
  }

  if (transaction.value !== "0") {
    return "Transfer";
  }

  return "Transaction Sent";
}

function getTransactionDescription(transaction: WalletTransaction) {
  if (!transaction.decoded) {
    return `To: ${shortenAddress(transaction.to_address)}`;
  }

  if (
    typeof transaction.decoded.inputs === "object" &&
    transaction.decoded.inputs !== null
  ) {
    if (
      "to" in transaction.decoded.inputs &&
      typeof transaction.decoded.inputs.to === "string"
    ) {
      return `To: ${shortenAddress(transaction.decoded.inputs.to)}`;
    }

    if (
      "spender" in transaction.decoded.inputs &&
      typeof transaction.decoded.inputs.spender === "string"
    ) {
      return `Spender: ${shortenAddress(transaction.decoded.inputs.spender)}`;
    }
  }

  return `To: ${shortenAddress(transaction.to_address)}`;
}

export function TransactionsSection(props: { client: ThirdwebClient }) {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();

  const txQuery = useQuery({
    enabled: !!account && !!activeChain,
    queryFn: async () => {
      if (!account || !activeChain) {
        return [];
      }
      const chains = [...new Set([1, 8453, 10, 137, activeChain.id])];
      const url = new URL(
        `https://insight.${isProd ? "thirdweb" : "thirdweb-dev"}.com/v1/wallets/${account.address}/transactions`,
      );
      url.searchParams.set("limit", "20");
      url.searchParams.set("decode", "true");
      url.searchParams.set("clientId", props.client.clientId);

      const threeMonthsAgoUnixTime = Math.floor(
        (Date.now() - 3 * 30 * 24 * 60 * 60 * 1000) / 1000,
      );

      url.searchParams.set(
        "filter_block_timestamp_gte",
        `${threeMonthsAgoUnixTime}`,
      );

      for (const chain of chains) {
        url.searchParams.append("chain", chain.toString());
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(
          `Failed to fetch transactions: ${response.status} - ${await response.text()}`,
        );
      }

      const json = (await response.json()) as {
        data?: WalletTransaction[];
      };

      return json.data ?? [];
    },
    queryKey: ["v1/wallets/transactions", account?.address, activeChain?.id],
    retry: false,
  });

  return (
    <TransactionSectionUI
      client={props.client}
      data={txQuery.data ?? []}
      isPending={txQuery.isPending}
    />
  );
}
