import { ScrollShadow } from "@/components/ui/ScrollShadow/ScrollShadow";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortBy, TimeRange, TrendingContract } from "lib/search";
import { CircleArrowDown, CircleArrowUp, DotIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { shortenAddress } from "thirdweb/utils";
import { ChainIcon } from "../../(chain)/components/server/chain-icon";
import { TablePagination } from "./pagination.client";
import { SortingHeader } from "./sorting-header.client";

export function TrendingContractSection(props: {
  topContracts: TrendingContract[];
  chainId?: number;
  perPage?: number;
  searchParams:
    | { timeRange?: TimeRange; page?: number; sortBy?: SortBy }
    | undefined;
  showPagination: boolean;
}) {
  const { page } = props.searchParams || {};
  const firstIndex = Math.max(0, ((page || 1) - 1) * (props.perPage || 10));
  const showChainColumn = !props.chainId;

  return (
    props.topContracts.length > 0 && (
      <div>
        <ScrollShadow scrollableClassName="rounded-lg border">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="text-left">Rank</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Change</TableHead>
                {showChainColumn && <TableHead>Chain</TableHead>}
                <TableHead className="text-center">Type</TableHead>
                <TableHead>
                  <SortingHeader
                    title="Transactions"
                    sortBy="transactionCount"
                    searchParams={props.searchParams}
                  />
                </TableHead>
                <TableHead>
                  <SortingHeader
                    title="Wallets"
                    sortBy="walletCount"
                    searchParams={props.searchParams}
                  />
                </TableHead>
                <TableHead>
                  <SortingHeader
                    title="Gas Usage"
                    sortBy="gasUsage"
                    searchParams={props.searchParams}
                  />
                </TableHead>
                <TableHead>
                  <SortingHeader
                    title="Value Moved"
                    sortBy="totalValueMoved"
                    searchParams={props.searchParams}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.topContracts.map((contract, index) => (
                <TableRow
                  className="relative hover:bg-muted even:bg-secondary/30 "
                  key={`${contract.chainMetadata.chainId}${contract.contractAddress}${index}`}
                >
                  {/* Rank */}
                  <TableCell className="text-left">
                    {index + 1 + firstIndex}
                  </TableCell>

                  {/* Contract name */}
                  <TableCell className="font-medium">
                    <Link
                      href={`/${contract.chainMetadata.chainId}/${contract.contractAddress}`}
                      target="_blank"
                      className="before:absolute before:inset-0 before:z-0 static before:content-[''] "
                    >
                      {getContractName(contract)}
                    </Link>
                  </TableCell>

                  {/* % Change */}
                  <TableCell className="text-left flex justify-start">
                    <ChangeCell
                      displayCount={contract.transactionCount}
                      change={contract.transactionCountChange}
                    />
                  </TableCell>

                  {/* Chain */}
                  {showChainColumn && (
                    <TableCell>
                      <ChainCell chainMetadata={contract.chainMetadata} />
                    </TableCell>
                  )}

                  {/* Type */}
                  <TableCell className="text-center">
                    {contract.type ? (
                      <Badge variant="outline" className="px-2 py-1 font-mono">
                        {contract.type}
                      </Badge>
                    ) : (
                      <DotIcon className="size-6 inline text-secondary-foreground" />
                    )}
                  </TableCell>

                  {/* Tx count */}
                  <TableCell className="text-right">
                    {contract.transactionCount}
                  </TableCell>

                  {/* Wallet Count */}
                  <TableCell className="text-right">
                    {contract.walletCount}
                  </TableCell>

                  {/* Gas Usage */}
                  <TableCell className="text-right">
                    {contract.gasUsage}
                  </TableCell>

                  {/* Value Moved */}
                  <TableCell className="text-right">
                    {contract.valueMoved || (
                      <DotIcon className="size-6 inline text-secondary-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollShadow>

        {props.showPagination && (
          <div className="w-full flex flex-row gap-4 justify-end mt-10">
            <TablePagination />
          </div>
        )}
      </div>
    )
  );
}

function ChangeCell(props: { displayCount: string; change: number }) {
  if (!props.displayCount) {
    return null;
  }
  const badge = (
    <Badge
      variant={props.change > 0 ? "success" : "destructive"}
      className="gap-1.5 px-2 py-1 min-w-[80px] flex justify-center"
    >
      {props.change > 0 ? (
        <CircleArrowUp className="size-4" />
      ) : (
        <CircleArrowDown className="size-4" />
      )}
      {props.change < 10 ? props.change.toFixed(1) : props.change.toFixed(0)}%
    </Badge>
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
    <Link
      href={`/${chainMetadata.chainId}`}
      target="_blank"
      className="flex flex-row items-center gap-3 hover:underline relative z-1"
    >
      <ChainIcon iconUrl={chainMetadata.icon?.url} className="size-6" />
      {chainMetadata.name.split(" ")[0]}
    </Link>
  );
}

function getContractName(contract: TrendingContract) {
  if (contract.name && contract.name !== "Unimported Contract") {
    return contract.name;
  }
  return shortenAddress(contract.contractAddress);
}
