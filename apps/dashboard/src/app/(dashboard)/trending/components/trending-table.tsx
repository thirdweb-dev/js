import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
        <TableContainer>
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-card">
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
                  linkBox
                  className="hover:bg-card"
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
                      className="static before:absolute before:inset-0 before:z-0 before:content-[''] "
                    >
                      {getContractName(contract)}
                    </Link>
                  </TableCell>

                  {/* % Change */}
                  <TableCell className="flex justify-start text-left">
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
                      <DotIcon className="inline size-6 text-muted-foreground" />
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
                      <DotIcon className="inline size-6 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {props.showPagination && (
          <div className="mt-10 flex w-full flex-row justify-end gap-4">
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

  const variant = props.change > 0 ? "success" : "destructive";
  const badge = (
    <Badge
      variant={variant}
      className="flex min-w-[80px] justify-center gap-1.5 px-2 py-1"
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
    <div className="group flex flex-row items-center justify-end gap-2">
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
      className="relative z-1 flex flex-row items-center gap-3 hover:underline"
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
