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
import {} from "@radix-ui/react-tabs";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  to?: string;
  from?: string;
  contract?: string;
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    {tx.to && `To: ${tx.to} `}
                    {tx.from && `From: ${tx.from} `}
                    {tx.contract && `Contract: ${tx.contract} `}
                    {tx.method && ` Method: ${tx.method}`}
                  </TableCell>
                  <TableCell>{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                <TableRow key={index}>
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
