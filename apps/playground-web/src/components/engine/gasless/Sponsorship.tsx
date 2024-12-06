"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { useState } from "react";
import { baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { Webhook } from "./Webhook";

interface ClaimTransactionResults {
  queueId: string;
  status: string;
  toAddress: string;
  amount: string;
  timestamp?: number;
  chainId: number;
  network: string;
  errorMessage?: string;
}

// This says Sponsorship, but it's actually just displaying a dummy webhook

export function Sponsorship() {
  const [contractAddress, setContractAddress] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [queueId, setQueueId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ClaimTransactionResults[]>(
    [],
  );
  const [selectedContract, setSelectedContract] = useState<string>("");
  const account = useActiveAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error("Invalid contract address format");
      }

      const response = await fetch("/api/claimTo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: account?.address,
          quantity: quantity,
          contractAddress,
        }),
      });

      const data = await response.json();
      const { result } = data;
      setQueueId(result.queueId);

      const newTransaction: ClaimTransactionResults = {
        queueId: result.queueId,
        status: "Queued",
        toAddress: account?.address || "",
        amount: quantity,
        chainId: 84532,
        network: "Base Sep",
      };
      setTransactions((prev) => [...prev, newTransaction]);

      if (result.queueId) {
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(
            `/api/claimTo?queueId=${result.queueId}`,
          );
          const statusData = await statusResponse.json();

          setTransactions((prev) =>
            prev.map((tx) =>
              tx.queueId === result.queueId
                ? {
                    ...tx,
                    status: statusData.status,
                    errorMessage: statusData.errorMessage,
                  }
                : tx,
            ),
          );

          if (statusData.status === "Mined") {
            clearInterval(pollInterval);
            setIsLoading(false);
          } else if (statusData.status === "error") {
            clearInterval(pollInterval);
            setIsLoading(false);
            throw new Error(statusData.errorMessage || "Failed to mint NFT");
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error details:", error);
      setIsLoading(false);
    }
  };

  // 2 contracts here to show engine claim good, and engine claim bad. One has tokens, and the other doesnt so itll fail
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <br />
          <ConnectButton client={THIRDWEB_CLIENT} chain={baseSepolia} />
          <div className="text-gray-500 text-sm">
            <ol>Select an NFT Contract to mint</ol>
          </div>
          <Select
            onValueChange={(value) => {
              setContractAddress(value);
              setSelectedContract(value);
            }}
          >
            <SelectTrigger
              className={`w-full text-sm sm:text-base ${selectedContract === "0x1aE0BEDb93f92e3687F4f5FaFa846132a456FAd4" ? "text-green-500" : selectedContract === "0x021c08f83E2eF2Ab3DE80b78aC7d0daa3ABf73c4" ? "text-red-500" : ""}`}
            >
              <SelectValue placeholder="Contract Address" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="0x1aE0BEDb93f92e3687F4f5FaFa846132a456FAd4"
                className="text-green-500"
              >
                Engine Demo Treasure Chest (Successful Transaction)
              </SelectItem>
              <SelectItem
                value="0x021c08f83E2eF2Ab3DE80b78aC7d0daa3ABf73c4"
                className="text-red-500"
              >
                Engine Demo Treasure Chest (Failed Transaction)
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="text-gray-500 text-sm">
            <ol>Select the quantity of NFTs to mint</ol>
          </div>
          <Input
            type="number"
            placeholder="Quantity"
            aria-label="Quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="text-sm sm:text-base"
          />
          <Button
            type="submit"
            disabled={isLoading || !account}
            className="w-full text-sm sm:text-base"
          >
            {isLoading ? "Minting..." : "Mint NFT"}
          </Button>
        </div>
      </form>
      <Webhook queueId={queueId || ""} />

      <div className="mt-6">
        {transactions.map((tx) => (
          <div key={tx.queueId} className="text-sm">
            Status: {tx.status} - Amount: {tx.amount}
          </div>
        ))}
      </div>
    </div>
  );
}
