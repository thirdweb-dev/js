import { WalletAddress } from "@/components/blocks/wallet-address";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabButtons } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, ArrowRight, WalletIcon } from "lucide-react";
import { useState } from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { shortenHex } from "thirdweb/utils";
import type { TransactionDetails } from "../hooks/useGetRecentTransactions";

interface Contract {
  address: string;
  name: string;
  lastInteraction: string;
}

interface ActivityOverviewProps {
  chain: ChainMetadata;
  transactions: TransactionDetails[];
  contracts: Contract[];
  isLoading: boolean;
}

export function ActivityOverview({
  chain,
  transactions,
  contracts,
  isLoading,
}: ActivityOverviewProps) {
  const [activeTab, setActiveTab] = useState<"transactions" | "contracts">(
    "transactions",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index of the last transaction on the current page
  const lastIndex = currentPage * itemsPerPage;
  // Calculate the index of the first transaction on the current page
  const firstIndex = lastIndex - itemsPerPage;
  // Get the current transactions to display
  const currentTransactions = transactions.slice(firstIndex, lastIndex);
  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const explorer = chain.explorers?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <TabButtons
          tabs={[
            {
              name: "Transactions",
              isActive: activeTab === "transactions",
              isEnabled: true,
              onClick: () => setActiveTab("transactions"),
            },
            // {
            //   name: "Contracts",
            //   isActive: activeTab === "contracts",
            //   isEnabled: true,
            //   onClick: () => setActiveTab("contracts"),
            // },
          ]}
          tabClassName="font-medium !text-sm"
        />

        {isLoading ? (
          <Spinner />
        ) : activeTab === "transactions" ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Value ({chain.nativeCurrency.symbol})</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.hash}>
                    <TableCell>
                      <span title={transaction.date.toLocaleString()}>
                        {formatDistanceToNow(transaction.date, {
                          addSuffix: true,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        onClick={() =>
                          window.open(`${explorer?.url}/tx/${transaction.hash}`)
                        }
                        className="font-mono"
                      >
                        {shortenHex(transaction.hash)}
                      </Button>
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      {transaction.type === "in" ? (
                        <div className="flex items-center gap-2">
                          <WalletIcon />
                          <ArrowLeft className="text-blue-500" />
                          <WalletAddress
                            address={transaction.from}
                            shortenAddress={false}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <WalletIcon />
                          <ArrowRight className="text-green-500" />
                          <WalletAddress
                            address={transaction.to}
                            shortenAddress={false}
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.valueTokens > 0 &&
                        transaction.valueTokens.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="pagination">
              <TabButtons
                tabs={[
                  {
                    name: "Previous",
                    isActive: currentPage === 1,
                    isEnabled: currentPage > 1,
                    onClick: () =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1)),
                  },
                  {
                    name: `Page ${currentPage} of ${totalPages}`,
                    isActive: true,
                    isEnabled: false,
                    onClick: () => {}, // No action needed
                  },
                  {
                    name: "Next",
                    isActive: currentPage === totalPages,
                    isEnabled: currentPage < totalPages,
                    onClick: () =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
                  },
                ]}
                tabClassName="font-medium !text-sm"
              />
            </div>
          </>
        ) : activeTab === "contracts" ? (
          <Table>
            {/* <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Interaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>contracts.map((contract, index) => (
                <TableRow key={`${contract.address}-${index}`}>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.address}</TableCell>
                  <TableCell>{contract.lastInteraction}</TableCell>
                </TableRow>
              ))
            </TableBody> */}
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
