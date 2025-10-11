"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { type Bridge, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export function TokensTable(props: {
  tokens: Bridge.TokenWithPrices[];
  pageSize: number;
  isFetching: boolean;
  pagination: {
    onNext: () => void;
    onPrevious: () => void;
    nextDisabled: boolean;
    previousDisabled: boolean;
  };
}) {
  const { tokens, isFetching } = props;

  return (
    <div className="border rounded-xl overflow-hidden">
      <TableContainer className="border-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Market cap</TableHead>
              <TableHead>Volume (24h)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching
              ? new Array(props.pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              : tokens.length > 0
                ? tokens.map((token) => {
                    const price = token.prices.USD;
                    return (
                      <TableRow
                        key={`${token.chainId}-${token.address}`}
                        className="hover:bg-accent/50"
                        linkBox
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage
                                src={token.iconUri ?? undefined}
                                alt={token.symbol}
                                className="rounded-full"
                              />
                              <AvatarFallback>
                                {token.symbol?.slice(0, 2)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1.5">
                              <span className="font-medium leading-none text-base">
                                {token.symbol}
                              </span>
                              <span className="text-sm text-muted-foreground leading-none">
                                {token.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {price ? formatPrice(price) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {token.marketCapUsd
                            ? formatUsdCompact(token.marketCapUsd)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {token.volume24hUsd
                            ? formatUsdCompact(token.volume24hUsd)
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-full bg-card hover:border-foreground/50 text-muted-foreground hover:bg-inverted hover:text-inverted-foreground"
                          >
                            <Link
                              aria-label={`Buy ${token.symbol}`}
                              href={
                                token.address.toLowerCase() ===
                                NATIVE_TOKEN_ADDRESS.toLowerCase()
                                  ? `/${token.chainId}`
                                  : `/${token.chainId}/${token.address}`
                              }
                              prefetch={false}
                              className="before:absolute before:inset-0"
                            >
                              Buy
                              <ArrowRightIcon className="size-3" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
          </TableBody>
        </Table>
      </TableContainer>

      {tokens.length === 0 && !isFetching && (
        <div className="flex items-center justify-center py-20 text-muted-foreground w-full text-sm ">
          No tokens found
        </div>
      )}

      <div className="flex justify-end p-4 gap-3 border-t bg-card">
        <Button
          variant="outline"
          className="gap-2 rounded-full"
          size="sm"
          onClick={() => props.pagination.onPrevious()}
          disabled={props.pagination.previousDisabled || isFetching}
        >
          <ArrowLeftIcon className="size-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          className="gap-2 rounded-full"
          size="sm"
          onClick={() => props.pagination.onNext()}
          disabled={props.pagination.nextDisabled || isFetching}
        >
          Next
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function formatPrice(value: number): string {
  if (value < 100) {
    return smallValueUSDFormatter.format(value);
  }
  return largeValueUSDFormatter.format(value);
}

const smallValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 6,
  roundingMode: "halfEven",
});

const largeValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  roundingMode: "halfEven",
});

const compactValueUSDFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
  roundingMode: "halfEven",
});

function formatUsdCompact(value: number): string {
  return compactValueUSDFormatter.format(value);
}
