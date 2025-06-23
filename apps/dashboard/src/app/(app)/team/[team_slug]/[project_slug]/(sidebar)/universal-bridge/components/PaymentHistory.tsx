"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { type ThirdwebClient, toTokens } from "thirdweb";
import {
  getPayments,
  type Payment,
  type PaymentsResponse,
} from "@/api/universal-bridge/developer";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  CardHeading,
  TableData,
  TableHeading,
  TableHeadingRow,
} from "./common";

const pageSize = 50;

export function PaymentHistory(props: {
  client: ThirdwebClient;
  projectClientId: string;
  teamId: string;
}) {
  const [page, setPage] = useState(1);
  const { data: payPurchaseData, isLoading } = useQuery<
    PaymentsResponse,
    Error
  >({
    queryFn: async () => {
      const res = await getPayments({
        clientId: props.projectClientId,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        teamId: props.teamId,
      });
      return res;
    },
    queryKey: ["payments", props.projectClientId, page],
    refetchInterval: 10_000,
  });
  const isEmpty = useMemo(
    () => !payPurchaseData?.data.length,
    [payPurchaseData],
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading> Transaction History</CardHeading>
        <ExportToCSVButton
          fileName="transaction_history"
          getData={async () => {
            return getCSVData(payPurchaseData?.data || []);
          }}
        />
      </div>

      <div className="h-5" />

      <div>
        <ScrollShadow className="overflow-hidden rounded-lg border">
          <table className="w-full selection:bg-inverted selection:text-inverted-foreground ">
            <thead>
              <TableHeadingRow>
                <TableHeading> Sent </TableHeading>
                <TableHeading> Received </TableHeading>
                <TableHeading>Type</TableHeading>
                <TableHeading>Status</TableHeading>
                <TableHeading>Recipient</TableHeading>
                <TableHeading>Date</TableHeading>
              </TableHeadingRow>
            </thead>
            <tbody>
              {(!isEmpty || isLoading) &&
                (payPurchaseData && !isLoading
                  ? payPurchaseData.data.map((purchase) => {
                      return (
                        <TableRow
                          client={props.client}
                          key={purchase.id}
                          purchase={purchase}
                        />
                      );
                    })
                  : new Array(pageSize).fill(0).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: ok
                      <SkeletonTableRow key={i} />
                    )))}
            </tbody>
          </table>

          {isEmpty && !isLoading ? (
            <div className="flex min-h-[150px] w-full items-center justify-center text-muted-foreground text-sm">
              No data available
            </div>
          ) : payPurchaseData ? (
            <div className="my-8">
              <PaginationButtons
                activePage={page}
                onPageClick={setPage}
                totalPages={Math.ceil(
                  payPurchaseData.meta.totalCount / pageSize,
                )}
              />
            </div>
          ) : null}
        </ScrollShadow>
      </div>
    </div>
  );
}

function TableRow(props: { purchase: Payment; client: ThirdwebClient }) {
  const { purchase } = props;
  const originAmount = toTokens(
    purchase.originAmount,
    purchase.originToken.decimals,
  );
  const destinationAmount = toTokens(
    purchase.destinationAmount,
    purchase.destinationToken.decimals,
  );
  const type = (() => {
    if (purchase.originToken.chainId !== purchase.destinationToken.chainId) {
      return "Bridge";
    }
    if (purchase.originToken.address !== purchase.destinationToken.address) {
      return "Swap";
    }
    return "Transfer";
  })();

  return (
    <tr
      className="fade-in-0 border-border border-b duration-300"
      key={purchase.id}
    >
      {/* Paid */}
      <TableData>{`${formatTokenAmount(originAmount)} ${purchase.originToken.symbol}`}</TableData>

      {/* Bought */}
      <TableData>
        {`${formatTokenAmount(destinationAmount)} ${purchase.destinationToken.symbol}`}
      </TableData>

      {/* Type */}
      <TableData>
        <Badge
          className={cn(
            "uppercase",
            type === "Transfer"
              ? "bg-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200"
              : "bg-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
          )}
          variant="secondary"
        >
          {type}
        </Badge>
      </TableData>

      {/* Status */}
      <TableData>
        <Badge
          className="capitalize"
          variant={
            purchase.status === "COMPLETED"
              ? "success"
              : purchase.status === "PENDING"
                ? "warning"
                : "destructive"
          }
        >
          {purchase.status}
        </Badge>
      </TableData>

      {/* Address */}
      <TableData>
        <WalletAddress address={purchase.sender} client={props.client} />
      </TableData>

      {/* Date */}
      <TableData>
        <p className="min-w-[180px] lg:min-w-auto">
          {format(new Date(purchase.createdAt), "LLL dd, y h:mm a")}
        </p>
      </TableData>
    </tr>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-border border-b">
      <TableData>
        <Skeleton className="h-7 w-20" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-[140px]" />
      </TableData>
      <TableData>
        <Skeleton className="h-7 w-[200px]" />
      </TableData>
    </tr>
  );
}

function getCSVData(data: Payment[]) {
  const header = ["Type", "Bought", "Paid", "Status", "Recipient", "Date"];

  const rows: string[][] = data.map((purchase) => {
    const toAmount = toTokens(
      purchase.destinationAmount,
      purchase.destinationToken.decimals,
    );
    const fromAmount = toTokens(
      purchase.originAmount,
      purchase.originToken.decimals,
    );
    const type = (() => {
      if (purchase.originToken.chainId !== purchase.destinationToken.chainId) {
        return "BRIDGE";
      }
      if (purchase.originToken.address !== purchase.destinationToken.address) {
        return "SWAP";
      }
      return "TRANSFER";
    })();

    return [
      // bought
      `${formatTokenAmount(toAmount)} ${purchase.destinationToken.symbol}`,
      // paid
      `${formatTokenAmount(fromAmount)} ${purchase.originToken.symbol}`,
      // type
      type,
      // status
      purchase.status,
      // sender
      purchase.sender,
      // date
      format(new Date(purchase.createdAt), "LLL dd y h:mm a"),
    ];
  });

  return { header, rows };
}

function formatTokenAmount(value: string) {
  // have at max 3 decimal places
  const strValue = Number(`${Number(value).toFixed(3)}`);

  if (Number(strValue) === 0) {
    return "~0";
  }
  return strValue;
}
