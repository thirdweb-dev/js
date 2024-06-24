import { useState } from "react";
import { CopyAddressButton } from "../../../../@/components/ui/CopyAddressButton";
import { ScrollShadow } from "../../../../@/components/ui/ScrollShadow/ScrollShadow";
import { Button } from "../../../../@/components/ui/button";
import { SkeletonContainer } from "../../../../@/components/ui/skeleton";
import {
  type PayTopCustomersData,
  usePayCustomers,
} from "../hooks/usePayCustomers";
import { ExportToCSVButton } from "./ExportToCSVButton";
import {
  NoDataAvailable,
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

function getUIData(topCustomersQuery: ReturnType<typeof usePayCustomers>): {
  data?: UIData;
  isError?: boolean;
  isLoading?: boolean;
} {
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
    return { isError: true };
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

  const uiData = getUIData(topCustomersQuery);

  const customersData = uiData.data?.customers;

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

      {!uiData.isError ? (
        <>
          <div className="h-5" />
          <RenderData
            data={uiData.data}
            loadMore={() => {
              topCustomersQuery.fetchNextPage();
            }}
          />
        </>
      ) : (
        <NoDataAvailable />
      )}
    </div>
  );
}

function RenderData(props: { data?: UIData; loadMore: () => void }) {
  return (
    <ScrollShadow scrollableClassName="h-[250px]" disableTopShadow={true}>
      <table className="w-full">
        <thead>
          <TableHeadingRow>
            <TableHeading> Wallet Address </TableHeading>
            <TableHeading> Total spend </TableHeading>
          </TableHeadingRow>
        </thead>
        <tbody>
          {props.data ? (
            props.data?.customers.map((customer, i) => {
              return (
                <CustomerTableRow
                  key={customer.walletAddress}
                  customer={customer}
                  rowIndex={i}
                />
              );
            })
          ) : (
            <>
              {new Array(5).fill(0).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ok
                <CustomerTableRow rowIndex={i} key={i} />
              ))}
            </>
          )}
        </tbody>
      </table>

      {props.data?.showLoadMore && (
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
