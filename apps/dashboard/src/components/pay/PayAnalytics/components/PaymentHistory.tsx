import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { PaginationButtons } from "@/components/pagination-buttons";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import {
  type PayPurchasesData,
  getPayPurchases,
  usePayPurchases,
} from "../hooks/usePayPurchases";
import {
  CardHeading,
  FailedToLoad,
  TableData,
  TableHeading,
  TableHeadingRow,
} from "./common";

type UIData = {
  purchases: PayPurchasesData["purchases"];
  pages: number;
};

const pageSize = 10;

type ProcessedQuery = {
  data?: UIData;
  isPending?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
};

function processQuery(
  purchasesQuery: ReturnType<typeof usePayPurchases>,
): ProcessedQuery {
  if (purchasesQuery.isPending) {
    return { isPending: true };
  }
  if (purchasesQuery.isError) {
    return { isError: true };
  }
  if (!purchasesQuery.data) {
    return { isEmpty: true };
  }

  const purchases = purchasesQuery.data.purchases;
  const totalCount = purchasesQuery.data.count;

  if (purchases.length === 0) {
    return { isEmpty: true };
  }

  return {
    data: {
      purchases,
      pages: Math.ceil(totalCount / pageSize),
    },
  };
}

export function PaymentHistory(props: {
  clientId: string;
  from: Date;
  to: Date;
}) {
  const [page, setPage] = useState(1);

  const purchasesQuery = usePayPurchases({
    clientId: props.clientId,
    from: props.from,
    to: props.to,
    start: (page - 1) * pageSize,
    count: pageSize,
  });

  const uiQuery = processQuery(purchasesQuery);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading> Transaction History</CardHeading>
        {!uiQuery.isError && (
          <ExportToCSVButton
            fileName="transaction_history"
            getData={async () => {
              const purchaseData = await getPayPurchases({
                clientId: props.clientId,
                count: 10000,
                from: props.from,
                start: 0,
                to: props.to,
              });

              return getCSVData(purchaseData.purchases);
            }}
          />
        )}
      </div>

      <div className="h-5" />

      {!uiQuery.isError ? (
        <RenderData
          query={uiQuery}
          activePage={page}
          setPage={setPage}
          isLoadingMore={purchasesQuery.isFetching}
        />
      ) : (
        <FailedToLoad />
      )}
    </div>
  );
}

function RenderData(props: {
  query: ProcessedQuery;
  isLoadingMore: boolean;
  activePage: number;
  setPage: (page: number) => void;
}) {
  return (
    <div>
      <ScrollShadow className="overflow-hidden rounded-lg border">
        <table className="w-full selection:bg-inverted selection:text-inverted-foreground ">
          <thead>
            <TableHeadingRow>
              <TableHeading> Bought </TableHeading>
              <TableHeading> Paid </TableHeading>
              <TableHeading>Type</TableHeading>
              <TableHeading>Status</TableHeading>
              <TableHeading>Recipient</TableHeading>
              <TableHeading>Date</TableHeading>
            </TableHeadingRow>
          </thead>
          <tbody>
            {!props.query.isEmpty &&
              (props.query.data && !props.isLoadingMore ? (
                <>
                  {props.query.data.purchases.map((purchase) => {
                    return (
                      <TableRow key={purchase.purchaseId} purchase={purchase} />
                    );
                  })}
                </>
              ) : (
                new Array(pageSize).fill(0).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <SkeletonTableRow key={i} />
                ))
              ))}
          </tbody>
        </table>

        {props.query.isEmpty ? (
          <div className="flex min-h-[150px] w-full items-center justify-center text-muted-foreground text-sm">
            No data available
          </div>
        ) : props.query.data ? (
          <div className="my-8">
            <PaginationButtons
              activePage={props.activePage}
              totalPages={props.query.data?.pages || 5}
              onPageClick={props.setPage}
            />
          </div>
        ) : null}
      </ScrollShadow>
    </div>
  );
}

function TableRow(props: { purchase: PayPurchasesData["purchases"][0] }) {
  const { purchase } = props;

  return (
    <tr
      key={purchase.purchaseId}
      className="fade-in-0 border-border border-b duration-300"
    >
      {/* Bought */}
      <TableData>{`${formatTokenAmount(purchase.toAmount)} ${purchase.toToken.symbol}`}</TableData>

      {/* Paid */}
      <TableData>
        {purchase.purchaseType === "SWAP"
          ? `${formatTokenAmount(purchase.fromAmount)} ${purchase.fromToken.symbol}`
          : `${formatTokenAmount(`${purchase.fromAmountUSDCents / 100}`)} ${purchase.fromCurrencySymbol}`}
      </TableData>

      {/* Type */}
      <TableData>
        <Badge
          variant="secondary"
          className={cn(
            "uppercase",
            purchase.purchaseType === "ONRAMP"
              ? "bg-fuchsia-200 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200"
              : "bg-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200",
          )}
        >
          {purchase.purchaseType === "ONRAMP" ? "Fiat" : "Crypto"}
        </Badge>
      </TableData>

      {/* Status */}
      <TableData>
        <Badge
          variant={
            purchase.status === "COMPLETED"
              ? "success"
              : purchase.status === "PENDING"
                ? "warning"
                : "destructive"
          }
          className="capitalize"
        >
          {purchase.status}
        </Badge>
      </TableData>

      {/* Address */}
      <TableData>
        <WalletAddress address={purchase.fromAddress} />
      </TableData>

      {/* Date */}
      <TableData>
        <p className="min-w-[180px] lg:min-w-auto">
          {format(new Date(purchase.updatedAt), "LLL dd, y h:mm a")}
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

function getCSVData(data: PayPurchasesData["purchases"]) {
  const header = ["Type", "Bought", "Paid", "Status", "Recipient", "Date"];

  const rows: string[][] = data.map((purchase) => [
    // bought
    `${formatTokenAmount(purchase.toAmount)} ${purchase.toToken.symbol}`,
    // paid
    purchase.purchaseType === "SWAP"
      ? `${formatTokenAmount(purchase.fromAmount)} ${purchase.fromToken.symbol}`
      : `${formatTokenAmount(`${purchase.fromAmountUSDCents / 100}`)} ${purchase.fromCurrencySymbol}`,
    // type
    purchase.purchaseType === "ONRAMP" ? "Fiat" : "Crypto",
    // status
    purchase.status,
    // recipient
    purchase.fromAddress,
    // date
    format(new Date(purchase.updatedAt), "LLL dd y h:mm a"),
  ]);

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
