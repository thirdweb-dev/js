import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ChainMetadata } from "thirdweb/chains";
import { shortenAddress } from "thirdweb/utils";
import { ChainIcon } from "../../(chain)/components/server/chain-icon";
import type {
  SortBy,
  TimeRange,
  TrendingContract,
} from "../../../../lib/search";
import { TablePagination } from "./pagination.client";
import { SortingHeader } from "./sorting-header.client";
import { TimeRangeSwitcher } from "./time-range-switcher.client";

export async function TrendingContractSection(props: {
  topContracts: TrendingContract[];
  chainId?: number;
  perPage?: number;
  searchParams: { timeRange?: TimeRange; page?: number; sortBy?: SortBy };
}) {
  const isLandingPage = props.chainId === undefined;
  const { page, timeRange } = props.searchParams;
  const firstIndex = Math.max(0, ((page || 1) - 1) * (props.perPage || 10));

  return (
    props.topContracts.length > 0 && (
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full flex flex-row gap-4 justify-center md:justify-end py-4">
          <TimeRangeSwitcher />
        </div>
        <Table
          className={`border-white ${isLandingPage && "border-b-[1px] font-mono text-xs md:text-sm mb-4"}`}
        >
          <TableHeader>
            <TableRow
              className={`bg-secondary ${isLandingPage && "border-white"}`}
            >
              <TableHead className="text-left">RANK</TableHead>
              <TableHead>CONTRACT</TableHead>
              <TableHead>
                <SortingHeader
                  title={`CHANGE (
              ${
                timeRange === "month"
                  ? "30d"
                  : timeRange === "week"
                    ? "7d"
                    : "24h"
              }
              )`}
                  sortBy="transactionCountChange"
                />
              </TableHead>
              {props.chainId ? null : <TableHead>CHAIN</TableHead>}
              <TableHead className="text-center">TYPE</TableHead>
              <TableHead>
                <SortingHeader title="TRANSACTIONS" sortBy="transactionCount" />
              </TableHead>
              <TableHead>
                <SortingHeader title="WALLETS" sortBy="walletCount" />
              </TableHead>
              <TableHead>
                <SortingHeader title="GAS USAGE" sortBy="gasUsage" />
              </TableHead>
              <TableHead>
                <SortingHeader title="VALUE MOVED" sortBy="totalValueMoved" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.topContracts.map((contract, index) => (
              <TableRow
                key={`${contract.chainMetadata.chainId}${contract.contractAddress}${index}`}
                className={`${isLandingPage && "border-white !border-x-[1px]"}`}
                style={{
                  backgroundColor: isLandingPage
                    ? `rgb(200, 72, 0, ${0.5 - index * 0.05})`
                    : isLandingPage
                      ? "rgba(0, 0, 0, 0.5)"
                      : undefined,
                }}
              >
                <TableCell className="text-left">
                  {index + 1 + firstIndex}
                </TableCell>
                <TableCell className="font-medium">
                  <a
                    href={`/${contract.chainMetadata.chainId}/${contract.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`${isLandingPage ? "underline" : "text-link-foreground"}`}
                  >
                    {getContractName(contract)}
                  </a>
                </TableCell>
                <TableCell className="text-left flex justify-start">
                  <ChangeCell
                    displayCount={contract.transactionCount}
                    change={contract.transactionCountChange}
                  />
                </TableCell>
                {props.chainId ? null : (
                  <TableCell>
                    <ChainCell chainMetadata={contract.chainMetadata} />
                  </TableCell>
                )}
                <TableCell className="text-center">
                  {contract.type ? contract.type : null}
                </TableCell>
                <TableCell className="text-right">
                  {contract.transactionCount}
                </TableCell>
                <TableCell className="text-right">
                  {contract.walletCount}
                </TableCell>
                <TableCell className="text-right">
                  {contract.gasUsage}
                </TableCell>
                <TableCell className="text-right">
                  {contract.valueMoved}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {isLandingPage && (
            <TableCaption className="text-left text-primary-foreground">
              built by{" "}
              <a href="https://thirdweb.com" className="underline">
                thirdweb
              </a>
            </TableCaption>
          )}
        </Table>
        <div className="w-full flex flex-row gap-4 justify-end">
          <TablePagination isLandingPage={isLandingPage} />
        </div>
      </div>
    )
  );
}

function ChangeCell(props: { displayCount: string; change: number }) {
  if (!props.displayCount) {
    return null;
  }
  const color = props.change > 0 ? "text-success-text" : "text-red-400";
  const badge = (
    <span className={`${color}`}>
      {props.change > 0 ? "▲" : "▼"}{" "}
      {props.change < 10 ? props.change.toFixed(1) : props.change.toFixed(0)}%
    </span>
  );
  return (
    <div className="flex flex-row items-center gap-2 justify-end group">
      {badge}
    </div>
  );
}

function ChainCell(props: { chainMetadata: ChainMetadata }) {
  const chainMetadata = props.chainMetadata;
  return (
    <div className="flex flex-row items-center gap-3">
      <ChainIcon iconUrl={chainMetadata.icon?.url} className="size-6" />
      <a
        href={`/${chainMetadata.chainId}`}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        {chainMetadata.name.split(" ")[0]}
      </a>
    </div>
  );
}

function getContractName(contract: TrendingContract) {
  if (contract.name && contract.name !== "Unimported Contract") {
    return contract.name;
  }
  return shortenAddress(contract.contractAddress);
}
