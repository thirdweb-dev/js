"use client";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { type ThirdwebClient, type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type TokenTransfersData,
  useTokenTransfers,
} from "../_hooks/useTokenTransfers";

const tokenAmountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
  notation: "compact",
});

function RecentTransfersUI(props: {
  data: TokenTransfersData[];
  tokenMetadata: {
    decimals: number;
    symbol: string;
  };
  isPending: boolean;
  rowsPerPage: number;
  page: number;
  setPage: (page: number) => void;
  explorerUrl: string;
  client: ThirdwebClient;
}) {
  const groupedData = useMemo(() => {
    const data: Array<{
      group: TokenTransfersData[];
      transactionHash: string;
      blockTimestamp: string;
    }> = [];

    for (const transfer of props.data) {
      const existingGroup = data.find(
        (group) => group.transactionHash === transfer.transaction_hash,
      );

      if (existingGroup) {
        existingGroup.group.push(transfer);
      } else {
        data.push({
          group: [transfer],
          transactionHash: transfer.transaction_hash,
          blockTimestamp: transfer.block_timestamp,
        });
      }
    }

    return data;
  }, [props.data]);

  return (
    <div>
      <div className="p-4 lg:p-6 bg-card border rounded-b-none border-b-0 rounded-lg">
        <h2 className="font-semibold text-2xl tracking-tight mb-0.5">
          Recent Transfers
        </h2>
        <p className="text-muted-foreground text-sm">
          Track all token transfers with detailed information about senders,
          recipients, amounts, and transaction timestamps
        </p>
      </div>

      <TableContainer className="rounded-b-none rounded-t-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.isPending
              ? Array.from({ length: props.rowsPerPage }).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: EXPECTED
                  <SkeletonRow key={index} />
                ))
              : groupedData.map((group) => (
                  <TableRow
                    className="fade-in-0 animate-in duration-300"
                    key={group.transactionHash}
                  >
                    {/* From */}
                    <TableCell className="relative space-y-1">
                      {group.group.map((transfer) => (
                        <div
                          className="h-10 flex items-center gap-6 w-[150px]"
                          key={transfer.log_index}
                        >
                          <WalletAddress
                            address={transfer.from_address}
                            client={props.client}
                          />
                          <ArrowRightIcon className="size-4 text-muted-foreground/50 absolute -right-1 lg:right-3" />
                        </div>
                      ))}
                    </TableCell>

                    {/* To */}
                    <TableCell className="relative space-y-1">
                      {group.group.map((transfer) => (
                        <div
                          className="h-10 flex items-center gap-6 w-[150px]"
                          key={transfer.log_index}
                        >
                          <WalletAddress
                            address={transfer.to_address}
                            client={props.client}
                            key={transfer.log_index}
                          />
                        </div>
                      ))}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="space-y-1">
                      {group.group.map((transfer) => (
                        <div
                          className="h-10 flex items-center"
                          key={transfer.log_index}
                        >
                          <TokenAmount
                            amount={transfer.amount}
                            decimals={props.tokenMetadata.decimals}
                            symbol={props.tokenMetadata.symbol}
                          />
                        </div>
                      ))}
                    </TableCell>

                    {/* timestamp */}
                    <TableCell>
                      <div
                        key={group.blockTimestamp}
                        className="capitalize text-muted-foreground text-sm"
                      >
                        {timestamp(group.blockTimestamp)}
                      </div>
                    </TableCell>

                    {/* transaction */}
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="text-muted-foreground hover:text-foreground rounded-full size-9 p-0 flex items-center justify-center"
                        >
                          <a
                            href={`${props.explorerUrl}/tx/${group.transactionHash}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <ExternalLinkIcon className="size-3.5" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {props.data.length === 0 && !props.isPending && (
          <div className="flex w-full items-center justify-center py-20">
            <p className="text-muted-foreground">No transfers found</p>
          </div>
        )}
      </TableContainer>

      <div className="flex items-center justify-end gap-3 rounded-b-lg border-x border-b bg-card px-6 py-5">
        <Button
          className="gap-1.5 bg-background rounded-full"
          disabled={props.page === 0 || props.isPending}
          onClick={() => props.setPage(props.page - 1)}
          size="sm"
          variant="outline"
        >
          <ChevronLeftIcon className="size-4 text-muted-foreground" />
          Previous
        </Button>
        <Button
          className="gap-1.5 bg-background rounded-full"
          disabled={props.isPending || props.data.length < props.rowsPerPage}
          onClick={() => props.setPage(props.page + 1)}
          size="sm"
          variant="outline"
        >
          Next
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

function timestamp(block_timestamp: string) {
  return formatDistanceToNow(
    new Date(
      block_timestamp.endsWith("Z") ? block_timestamp : `${block_timestamp}Z`,
    ),
    {
      addSuffix: true,
    },
  );
}

function TokenAmount(props: {
  amount: string;
  decimals: number;
  symbol: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span>
        {tokenAmountFormatter.format(
          Number(toTokens(BigInt(props.amount), props.decimals)),
        )}
      </span>
      <span className="text-muted-foreground text-xs">{props.symbol}</span>
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow className="fade-in-0 h-[73px] animate-in duration-300">
      <TableCell>
        <Skeleton className="h-6 w-[145px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[145px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="size-9 rounded-full" />
      </TableCell>
    </TableRow>
  );
}

export function RecentTransfers(props: {
  clientContract: ThirdwebContract;
  tokenSymbol: string;
  chainMetadata: ChainMetadata;
  decimals: number;
}) {
  const rowsPerPage = 10;
  const [page, setPage] = useState(0);

  const tokenQuery = useTokenTransfers({
    chainId: props.clientContract.chain.id,
    contractAddress: props.clientContract.address,
    limit: rowsPerPage,
    page,
  });

  return (
    <RecentTransfersUI
      client={props.clientContract.client}
      data={tokenQuery.data ?? []}
      explorerUrl={
        props.chainMetadata.explorers?.[0]?.url ||
        `https://thirdweb.com/${props.chainMetadata.slug}`
      }
      isPending={tokenQuery.isPending}
      page={page}
      rowsPerPage={rowsPerPage}
      setPage={setPage}
      tokenMetadata={{
        decimals: props.decimals,
        symbol: props.tokenSymbol,
      }}
    />
  );
}
