"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { prepareTransaction, type ThirdwebClient, toWei } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { TransactionButton } from "@/components/tx-button";
import { Input } from "@/components/ui/input";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { mapV4ChainToV5Chain } from "@/utils/map-chains";

export function DepositNative(props: {
  address: string;
  symbol: string;
  chain: ChainMetadata;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}) {
  const sendAndConfirmTx = useSendAndConfirmTx();
  const [amount, setAmount] = useState("");

  return (
    <div className="flex flex-row items-center max-w-lg">
      <Input
        onChange={(e) => setAmount(e.currentTarget.value)}
        placeholder="0.001"
        type="number"
        className="border-r-0 rounded-r-none bg-card"
        value={amount}
      />

      <TransactionButton
        client={props.client}
        variant="default"
        disabled={amount.length === 0 || Number.parseFloat(amount) <= 0}
        isLoggedIn={props.isLoggedIn}
        className="border-l-0 rounded-l-none px-6"
        isPending={sendAndConfirmTx.isPending}
        onClick={() => {
          const transaction = prepareTransaction({
            // eslint-disable-next-line no-restricted-syntax
            chain: mapV4ChainToV5Chain(props.chain),
            client: props.client,
            to: props.address,
            value: toWei(amount),
          });
          sendAndConfirmTx.mutate(transaction, {
            onSuccess: () => {
              toast.success("Deposit successful");
              setAmount("");
            },
            onError: (error) => {
              toast.error("Deposit failed", {
                description: error.message,
              });
            },
          });
        }}
        transactionCount={undefined}
        txChainID={props.chain.chainId}
      >
        Deposit
        <ArrowUpRightIcon className="w-4 h-4" />
      </TransactionButton>
    </div>
  );
}
