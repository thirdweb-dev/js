"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type React from "react";
import { useState } from "react";
import { format } from "timeago.js";

interface ClaimTransactionResults {
  queueId: string;
  status: "Queued" | "Sent" | "Mined" | "error";
  transactionHash?: string;
  blockExplorerUrl?: string;
  errorMessage: "Error" | undefined;
  toAddress: string;
  amount: string;
  timestamp?: number;
  chainId: number;
  network: "Ethereum" | "Base Sep" | "OP Sep";
}

interface ClaimTransactionResultsProps {
  results: ClaimTransactionResults[];
}
// I did have one component of this, but it was causing weird queuing issues when shared among multiple components. So just created one for each instead.
export function ClaimTransactionResults({
  results,
}: ClaimTransactionResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const itemsPerPage = 2;
  // Added dummy transactions so the table doesn't look empty.
  const dummyTransaction1: ClaimTransactionResults = {
    queueId: "0x1234567890abcdef",
    status: "Mined",
    transactionHash: "0xabcdef1234567890",
    blockExplorerUrl: "https://etherscan.io/tx/0xabcdef1234567890",
    toAddress: "0x1234567890abcdef",
    amount: "1.0",
    timestamp: Date.now() - 15 * 60 * 1000,
    chainId: 1,
    network: "Ethereum",
    errorMessage: undefined,
  };

  const dummyTransaction2: ClaimTransactionResults = {
    queueId: "0x9876543210fedcba",
    status: "Mined",
    transactionHash: "0x1234567890abcdef",
    blockExplorerUrl: "https://etherscan.io/tx/0x1234567890abcdef",
    toAddress: "0xabcdef1234567890",
    amount: "0.5",
    timestamp: Date.now() - 30 * 60 * 1000,
    chainId: 1,
    network: "Base Sep",
    errorMessage: undefined,
  };

  const sortedResults = [...results].reverse();
  const sortedResultsWithDummy = [
    ...sortedResults,
    dummyTransaction1,
    dummyTransaction2,
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedResultsWithDummy.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedResultsWithDummy.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const getDisplayStatus = (result: ClaimTransactionResults) => {
    if (result.status === "Mined" && !result.transactionHash) {
      return "Pending";
    }
    return result.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mined":
        return "bg-green-500/20 text-green-400";
      case "Queued":
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "Sent":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-red-500/20 text-red-400";
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtStart = target.scrollLeft === 0;
    const isAtEnd =
      target.scrollLeft + target.clientWidth >= target.scrollWidth - 1; // -1 for rounding errors

    setShowLeftGradient(!isAtStart);
    setShowRightGradient(!isAtEnd);
  };

  return (
    <Card className="mt-8 w-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="font-semibold text-foreground text-xl">
          Transaction Results
        </h2>
        <span className="text-muted-foreground text-sm">
          Last 24 hours • {sortedResultsWithDummy.length} transactions
        </span>
      </CardHeader>
      <CardContent className="relative max-h-[400px]">
        <div className="overflow-x-auto" onScroll={handleScroll}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[130px]">Queue ID</TableHead>
                <TableHead className="min-w-[120px]">Network</TableHead>
                <TableHead className="min-w-[130px]">From</TableHead>
                <TableHead className="min-w-[130px]">Queued</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[160px]">Tx Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((result, index) => (
                <TableRow key={`${result.network}-${result.queueId}-${index}`}>
                  <TableCell className="font-medium">
                    {result.queueId
                      ? `${result.queueId.substring(0, 6)}...${result.queueId.substring(
                          result.queueId.length - 4,
                        )}`
                      : "----"}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {result.network === "Base Sep" && (
                        <img
                          src="/BaseSep.png"
                          alt="Base"
                          className="h-4 w-4"
                        />
                      )}
                      {result.network === "OP Sep" && (
                        <img
                          src="/OP.png"
                          alt="Optimism Sep"
                          className="h-4 w-4"
                        />
                      )}
                      {result.network === "Ethereum" && (
                        <img
                          src="/Ethereum.png"
                          alt="Ethereum"
                          className="h-4 w-4"
                        />
                      )}
                      {result.network}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      if (!result.toAddress) return "----";

                      const addressDisplay = `${result.toAddress.substring(0, 6)}...${result.toAddress.substring(
                        result.toAddress.length - 4,
                      )}`;
                      // Keeping OP here for consistency. Will be adding a component for Optimism soon.
                      const getExplorerUrl = () => {
                        switch (result.network) {
                          case "Base Sep":
                            return `https://base-sepolia.blockscout.com/address/${result.toAddress}?tab=tokens`;
                          case "OP Sep":
                            return `https://optimism-sepolia.blockscout.com/address/${result.toAddress}?tab=tokens`;
                          case "Ethereum":
                            return `https://etherscan.io/address/${result.toAddress}?tab=tokens`;
                          default:
                            return null;
                        }
                      };

                      const explorerUrl = getExplorerUrl();

                      return explorerUrl ? (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[hsl(var(--link-foreground))] hover:text-foreground"
                        >
                          {addressDisplay}
                        </a>
                      ) : (
                        addressDisplay
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {result.timestamp ? format(result.timestamp) : "Just now"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 font-semibold text-xs leading-5 ${getStatusColor(getDisplayStatus(result))}`}
                    >
                      {getDisplayStatus(result)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {result.transactionHash && result.blockExplorerUrl ? (
                      <a
                        href={result.blockExplorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(var(--link-foreground))] hover:text-foreground"
                      >
                        {`${result.transactionHash.substring(0, 6)}...${result.transactionHash.substring(
                          result.transactionHash.length - 4,
                        )}`}
                      </a>
                    ) : result.errorMessage ? (
                      <span className="text-red-600">
                        {result.errorMessage}
                      </span>
                    ) : (
                      "----"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {showLeftGradient && (
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent sm:hidden" />
        )}
        {showRightGradient && (
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent sm:hidden" />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
