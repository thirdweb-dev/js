"use client";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { UniversalBridgeWalletStats } from "types/analytics";
import { ExportToCSVButton } from "@/components/blocks/ExportToCSVButton";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { SkeletonContainer } from "@/components/ui/skeleton";
import { toUSD } from "../../../../utils/number";
import {
  CardHeading,
  TableData,
  TableHeading,
  TableHeadingRow,
} from "./common";

type PayTopCustomersData = Array<{
  walletAddress: string;
  totalSpendUSDCents: number;
}>;

export function PayCustomersTable(props: {
  data: UniversalBridgeWalletStats[];
  client: ThirdwebClient;
}) {
  const tableData = useMemo(() => {
    return getTopCustomers(props.data);
  }, [props.data]);
  const isEmpty = useMemo(() => tableData.length === 0, [tableData]);

  return (
    <div className="flex flex-col">
      {/* header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <CardHeading>Top Customers </CardHeading>

        {tableData && (
          <ExportToCSVButton
            fileName="top_customers"
            getData={async () => {
              return getCSVData(tableData);
            }}
          />
        )}
      </div>

      <div className="h-5" />
      <ScrollShadow
        className="overflow-hidden rounded-lg border"
        disableTopShadow={true}
        scrollableClassName="h-[280px]"
      >
        <table className="w-full">
          <thead>
            <TableHeadingRow>
              <TableHeading> Wallet Address </TableHeading>
              <TableHeading> Total spend </TableHeading>
            </TableHeadingRow>
          </thead>
          <tbody className="relative">
            {tableData.map((customer, i) => {
              return (
                <CustomerTableRow
                  client={props.client}
                  customer={customer}
                  key={customer.walletAddress}
                  rowIndex={i}
                />
              );
            })}
          </tbody>
        </table>
        {isEmpty && (
          <div className="flex min-h-[240px] w-full items-center justify-center text-muted-foreground text-sm">
            No data available
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}

function CustomerTableRow(props: {
  customer?: {
    walletAddress: string;
    totalSpendUSDCents: number;
  };
  client: ThirdwebClient;
  rowIndex: number;
}) {
  const delayAnim = {
    animationDelay: `${props.rowIndex * 100}ms`,
  };

  return (
    <tr className="border-border border-b">
      <TableData>
        <SkeletonContainer
          className="inline-flex"
          loadedData={props.customer?.walletAddress}
          render={(v) => <WalletAddress address={v} client={props.client} />}
          skeletonData="0x0000000000000000000000000000000000000000"
          style={delayAnim}
        />
      </TableData>
      <TableData>
        <SkeletonContainer
          className="inline-flex"
          loadedData={props.customer?.totalSpendUSDCents}
          render={(v) => {
            return <p>${(v / 100).toLocaleString()}</p>;
          }}
          skeletonData={20000}
          style={delayAnim}
        />
      </TableData>
    </tr>
  );
}

function getCSVData(data: PayTopCustomersData) {
  const header = ["Wallet Address", "Total spend"];
  const rows = data.map((customer) => [
    customer.walletAddress,
    toUSD(customer.totalSpendUSDCents / 100),
  ]);

  return { header, rows };
}

function getTopCustomers(data: UniversalBridgeWalletStats[]) {
  const customers = new Set<string>();
  for (const item of data) {
    if (!customers.has(item.walletAddress) && item.amountUsdCents > 0) {
      customers.add(item.walletAddress);
    }
  }
  const customersData = [];
  for (const customer of customers) {
    const totalSpend = data
      .filter((x) => x.walletAddress === customer)
      .reduce((acc, curr) => acc + curr.amountUsdCents, 0);
    customersData.push({
      totalSpendUSDCents: totalSpend,
      walletAddress: customer,
    });
  }
  return customersData.sort(
    (a, b) => b.totalSpendUSDCents - a.totalSpendUSDCents,
  );
}
