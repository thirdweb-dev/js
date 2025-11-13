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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent,
} from "@/components/ui/table";
import { formatTokenAmount } from "./format";
import { PurchaseTableRow } from "./PaymentsTableRow";

const pageSize = 10;

export function PaymentHistory(props: {
  client: ThirdwebClient;
  projectClientId: string;
  teamId: string;
  authToken: string;
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
        authToken: props.authToken,
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
          <h2 className="font-semibold text-2xl tracking-tight mb-1">
            Transaction History
          </h2>
          <p className="text-muted-foreground text-sm">
            Track past transactions with amount, status, recipient, and date.
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

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRowComponent>
              <TableHead> Sent </TableHead>
              <TableHead> Received </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Transactions</TableHead>
            </TableRowComponent>
          </TableHeader>
          <TableBody>
            {(!isEmpty || isLoading) &&
              (payPurchaseData && !isLoading
                ? payPurchaseData.data
                    .filter(isBridgePayment)
                    .map((purchase) => {
                      return (
                        <PurchaseTableRow
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
          </TableBody>
        </Table>

        {isEmpty && !isLoading ? (
          <div className="flex min-h-[150px] w-full items-center justify-center text-muted-foreground text-sm">
            No data available
          </div>
        ) : payPurchaseData ? (
          <div className="py-4 border-t">
            <PaginationButtons
              activePage={page}
              onPageClick={setPage}
              totalPages={Math.ceil(payPurchaseData.meta.totalCount / pageSize)}
            />
          </div>
        ) : null}
      </TableContainer>
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
    <TableRowComponent className="h-[73px]">
      <TableCell>
        <Skeleton className="h-7 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-20 rounded-2xl" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[140px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-7 w-[200px]" />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-[100px]" />
          <Skeleton className="h-5 w-[100px]" />
        </div>
      </TableCell>
    </TableRowComponent>
  );
}
