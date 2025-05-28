"use client";
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
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useState } from "react";
import { type ThirdwebContract, toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  type TokenTransfersData,
  useTokenTransfers,
} from "../_hooks/useTokenTransfers";

const tokenAmountFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 3,
  minimumFractionDigits: 0,
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
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-semibold text-xl tracking-tight">
          Recent Transfers
        </h2>
        <p className="text-muted-foreground text-sm">
          Track all token transfers with detailed information about senders,
          recipients, amounts, and transaction timestamps
        </p>
      </div>

      <TableContainer className="rounded-b-none">
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
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <SkeletonRow key={index} />
                ))
              : props.data.map((transfer) => (
                  <TableRow
                    className="fade-in-0 animate-in duration-300"
                    key={
                      transfer.transaction_hash +
                      transfer.amount +
                      transfer.block_number +
                      transfer.from_address
                    }
                  >
                    <TableCell className="text-sm">
                      <WalletAddress address={transfer.from_address} />
                    </TableCell>
                    <TableCell className="text-sm">
                      <WalletAddress address={transfer.to_address} />
                    </TableCell>
                    <TableCell className="text-sm ">
                      <div className="flex items-center gap-1.5">
                        <span>
                          {tokenAmountFormatter.format(
                            Number(
                              toTokens(
                                BigInt(transfer.amount),
                                props.tokenMetadata.decimals,
                              ),
                            ),
                          )}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {props.tokenMetadata.symbol}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(new Date(transfer.block_timestamp), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <a
                          href={`${props.explorerUrl}/tx/${transfer.transaction_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "flex items-center justify-center",
                            "hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
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
          variant="outline"
          size="sm"
          className="gap-1.5 bg-background"
          disabled={props.page === 0 || props.isPending}
          onClick={() => props.setPage(props.page - 1)}
        >
          <ChevronLeftIcon className="size-4 text-muted-foreground" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={props.isPending || props.data.length === 0}
          className="gap-1.5 bg-background"
          onClick={() => props.setPage(props.page + 1)}
        >
          Next
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </Button>
      </div>
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
        <Skeleton className="h-6 w-6" />
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
    page,
    limit: rowsPerPage,
  });

  return (
    <div>
      <RecentTransfersUI
        data={tokenQuery.data ?? []}
        isPending={tokenQuery.isPending}
        rowsPerPage={rowsPerPage}
        tokenMetadata={{
          decimals: props.decimals,
          symbol: props.tokenSymbol,
        }}
        page={page}
        setPage={setPage}
        explorerUrl={
          props.chainMetadata.explorers?.[0]?.url ||
          `https://thirdweb.com/${props.chainMetadata.slug}`
        }
      />
    </div>
  );
}
