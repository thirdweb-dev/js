import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  type PayTopCustomersData,
  usePayCustomers,
} from "../hooks/usePayCustomers";
import { ExportToCSVButton } from "./ExportToCSVButton";
import {
  FailedToLoad,
  TableData,
  TableHeading,
  TableHeadingRow,
} from "./common";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UIData = {
  customers: Array<{
    walletAddress: string;
    totalSpendUSDCents: number;
  }>;
  showLoadMore: boolean;
};

type ProcessedQuery = {
  data?: UIData;
  isError?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
};

function processQuery(
  topCustomersQuery: ReturnType<typeof usePayCustomers>,
): ProcessedQuery {
  if (topCustomersQuery.isLoading) {
    return { isLoading: true };
  }

  if (topCustomersQuery.isError) {
    return { isError: true };
  }

  let customers = topCustomersQuery.data.pages.flatMap(
    (x) => x.pageData.customers,
  );

  customers = customers.filter((x) => x.totalSpendUSDCents > 0);

  if (customers.length === 0) {
    return { isEmpty: true };
  }

  return {
    data: {
      customers,
      showLoadMore: !!topCustomersQuery.hasNextPage,
    },
  };
}

export function PayCustomersTable(props: {
  clientId: string;
  from: Date;
  to: Date;
}) {
  const [type, setType] = useState<"top-customers" | "new-customers">(
    "top-customers",
  );

  const topCustomersQuery = usePayCustomers({
    clientId: props.clientId,
    from: props.from,
    to: props.to,
    pageSize: 100,
    type,
  });

  const uiQuery = processQuery(topCustomersQuery);

  const customersData = uiQuery.data?.customers;

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-2 lg:items-center">
        <Select
          value={type}
          onValueChange={(value: "top-customers" | "new-customers") => {
            setType(value);
          }}
        >
          <SelectTrigger className="bg-transparent w-auto border-none p-0 text-base focus:ring-transparent">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="top-customers">
              {" "}
              Top Customers By Spend{" "}
            </SelectItem>
            <SelectItem value="new-customers"> New Customers </SelectItem>
          </SelectContent>
        </Select>

        {customersData && (
          <ExportToCSVButton
            fileName="top_customers"
            getData={async () => {
              return getCSVData(customersData);
            }}
          />
        )}
      </div>

      {!uiQuery.isError ? (
        <>
          <div className="h-5" />
          <RenderData
            query={uiQuery}
            loadMore={() => {
              topCustomersQuery.fetchNextPage();
            }}
          />
        </>
      ) : (
        <FailedToLoad />
      )}
    </div>
  );
}

function RenderData(props: { query: ProcessedQuery; loadMore: () => void }) {
  return (
    <ScrollShadow scrollableClassName="h-[250px]" disableTopShadow={true}>
      <table className="w-full">
        <thead>
          <TableHeadingRow>
            <TableHeading> Wallet Address </TableHeading>
            <TableHeading> Total spend </TableHeading>
          </TableHeadingRow>
        </thead>
        <tbody className="relative">
          {props.query.isLoading ? (
            <>
              {new Array(5).fill(0).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <CustomerTableRow rowIndex={i} key={i} />
              ))}
            </>
          ) : (
            <>
              {props.query.data?.customers.map((customer, i) => {
                return (
                  <CustomerTableRow
                    key={customer.walletAddress}
                    customer={customer}
                    rowIndex={i}
                  />
                );
              })}
            </>
          )}
        </tbody>
      </table>

      {props.query.isEmpty && (
        <div className="min-h-[240px] flex items-center justify-center w-full text-muted-foreground text-sm">
          No data available
        </div>
      )}

      {props.query.data?.showLoadMore && (
        <div className="flex justify-center py-3">
          <Button
            className="text-sm text-link-foreground p-2 h-auto"
            variant="ghost"
            onClick={props.loadMore}
          >
            View More
          </Button>
        </div>
      )}
    </ScrollShadow>
  );
}

function CustomerTableRow(props: {
  customer?: {
    walletAddress: string;
    totalSpendUSDCents: number;
  };
  rowIndex: number;
}) {
  const delayAnim = {
    animationDelay: `${props.rowIndex * 100}ms`,
  };

  return (
    <tr className="border-b border-border">
      <TableData>
        <SkeletonContainer
          className="inline-flex"
          style={delayAnim}
          loadedData={props.customer?.walletAddress}
          skeletonData="0x0000000000000000000000000000000000000000"
          render={(v) => {
            return (
              <CopyAddressButton
                address={v}
                variant="ghost"
                className="text-secondary-foreground"
                copyIconPosition="left"
              />
            );
          }}
        />
      </TableData>
      <TableData>
        <SkeletonContainer
          style={delayAnim}
          className="inline-flex"
          loadedData={props.customer?.totalSpendUSDCents}
          skeletonData={20000}
          render={(v) => {
            return <p>${(v / 100).toLocaleString()}</p>;
          }}
        />
      </TableData>
    </tr>
  );
}

function getCSVData(data: PayTopCustomersData["customers"]) {
  const header = ["Wallet Address", "Total spend"];
  const rows = data.map((customer) => [
    customer.walletAddress,
    `$${(customer.totalSpendUSDCents / 100).toLocaleString()}`,
  ]);

  return { header, rows };
}
