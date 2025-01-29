import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  type: "out" | "in";
  value: string;
  to?: string;
  from?: string;
  method?: string;
  date: string;
}

interface Contract {
  address: string;
  name: string;
  lastInteraction: string;
}

interface ActivityOverviewProps {
  transactions: Transaction[];
  contracts: Contract[];
  isLoading: boolean;
}

export function ActivityOverview({
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
            {
              name: "Contracts",
              isActive: activeTab === "contracts",
              isEnabled: true,
              onClick: () => setActiveTab("contracts"),
            },
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
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.id.slice(0, 12)}...</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.value}</TableCell>
                    <TableCell>{tx.from}</TableCell>
                    <TableCell>{tx.to}</TableCell>
                    <TableCell>{formatDistanceToNow(tx.date)}</TableCell>
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
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Interaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract, index) => (
                <TableRow key={`${contract.address}-${index}`}>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>{contract.address}</TableCell>
                  <TableCell>{contract.lastInteraction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}
