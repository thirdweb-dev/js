"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ClaimTransactionResults as ClaimTransactionResultsComponent } from "./TransactionResults";

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

interface CsvRow {
  toAddress: string;
  amount: string;
}

interface BatchResult {
  queueId: string;
  addresses: string[];
  amounts: string[];
  status: "Queued" | "Sent" | "Mined" | "error";
  timestamp: number;
  chainId: number;
  network: "Ethereum" | "Base Sep" | "OP Sep";
}

// Setting dummy addresses so no one gets spammed.
export function AirdropERC20() {
  const [csvData] = useState<CsvRow[]>([
    { toAddress: "0x1f91EB653116A43413930c1df0CF5794fCc2D611", amount: "1" },
    { toAddress: "0xA707E9650631800a635c629e9C8E5937b7277a08", amount: "1" },
    { toAddress: "0xF1f466c973C197e5D9318F6241C2da31742d3d03", amount: "1" },
    { toAddress: "0x56671F2cb5d401f989Df5d3B4f8C814E6A022bf7", amount: "1" },
    { toAddress: "0x5F0633eD9c359C84F9A7B4A898DA6864893fe943", amount: "1" },
    { toAddress: "0x626522375a0F448fc7B87055f83a0402b89D06Eb", amount: "1" },
    { toAddress: "0x4D9c3Ae6ce7751616cB29E2bcF972357f28924E0", amount: "1" },
    { toAddress: "0xc4757A402F4c5a447B2b20670ADd10A042f1142D", amount: "1" },
    { toAddress: "0x9244B15679F4d4e1CEE0Ef6401A59b3d302c8Fca", amount: "1" },
    { toAddress: "0xF7DB7C0205f5Bf2E32F55A633703da1d075036A7", amount: "1" },
  ]);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  const paginatedData = csvData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );

  const totalPages = Math.ceil(csvData.length / rowsPerPage);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ClaimTransactionResults[]>([]);

  const pollTransactionStatus = async (queueId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/transaction-status?queueId=${queueId}`,
        );
        const status = await response.json();

        setResults((prevResults) =>
          prevResults.map((result) => {
            if (result.queueId === queueId) {
              return {
                ...result,
                ...status,
                status: status.status === "mined" ? "Mined" : status.status,
              };
            }
            return result;
          }),
        );

        if (status.status === "Mined" || status.status === "error") {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error polling status:", error);
        clearInterval(pollInterval);
      }
    }, 2000);

    setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResults([]);

    try {
      const response = await fetch("/api/erc20BatchMintTo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractAddress: "0xcB30dB8FB977e8b27ae34c86aF16C4F5E428c0bE",
          data: csvData.map((row) => ({
            toAddress: row.toAddress,
            amount: row.amount,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Transform the initial queued results
      const transformedResults = result.flatMap((batch: BatchResult) =>
        batch.addresses.map((address: string, index: number) => ({
          queueId: batch.queueId,
          status: batch.status,
          toAddress: address,
          amount: batch.amounts[index],
          timestamp: batch.timestamp,
          chainId: batch.chainId,
          network: batch.network,
        })),
      );

      setResults(transformedResults);

      // Start polling for each batch
      for (const batch of result) {
        pollTransactionStatus(batch.queueId);
      }
    } catch (error) {
      console.error("Error:", error);
      setResults([
        {
          queueId: "",
          status: "error",
          errorMessage: "Error",
          toAddress: "",
          amount: "",
          chainId: 84532,
          network: "Base Sep",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <br />
      <Card className="mt-8 w-full bg-background">
        <div className="space-y-6 p-6 sm:space-y-8">
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.toAddress}>
                    <TableCell>{row.toAddress}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <br />
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-4 sm:px-6 md:px-8"
      >
        {isSubmitting
          ? "Submitting..."
          : "Submit and watch the transaction results below"}
      </Button>
      <ClaimTransactionResultsComponent results={results} />
    </div>
  );
}
