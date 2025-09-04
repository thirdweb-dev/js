"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { type ThirdwebClient, toTokens } from "thirdweb";
import {
  type BridgePayment,
  getPayments,
  type Payment,
  type PaymentsResponse,
} from "@/api/universal-bridge/developer";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { PaginationButtons } from "@/components/blocks/pagination-buttons";
import { ScrollShadow } from "@/components/ui/ScrollShadow";
import { Skeleton } from "@/components/ui/skeleton";
import { TableData, TableHeading, TableHeadingRow } from "./common";
import { formatTokenAmount } from "./format";
import { TableRow } from "./PaymentsTableRow";

const pageSize = 20;

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
        <div>
          <h2 className="font-semibold text-xl tracking-tight">
            Transaction History
          </h2>
          <p className="text-muted-foreground text-sm">
            Past transactions from your project.
          </p>
        </div>
        <ExportToCSVButton
          fileName="transaction_history"
          getData={async () => {
            return getCSVData(
              payPurchaseData?.data.filter(isBridgePayment) || [],
            );
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
                  ? payPurchaseData.data
                      .filter(isBridgePayment)
                      .map((purchase) => {
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

function isBridgePayment(purchase: Payment): purchase is BridgePayment {
  return purchase.type !== "onramp";
}

function getCSVData(data: BridgePayment[]) {
  const header = ["Type", "Bought", "Paid", "Status", "Recipient", "Date"];

  const rows: string[][] = data.map((purchase) => {
    const toAmount = toTokens(
      BigInt(purchase.destinationAmount),
      purchase.destinationToken.decimals,
    );
    const fromAmount = toTokens(
      BigInt(purchase.originAmount),
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
