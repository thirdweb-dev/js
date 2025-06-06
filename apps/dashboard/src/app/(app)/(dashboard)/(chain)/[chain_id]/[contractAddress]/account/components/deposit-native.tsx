"use client";

import { Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useV5DashboardChain } from "lib/v5-adapter";
import { type ChangeEvent, useState } from "react";
import type { StoredChain } from "stores/chainStores";
import { type ThirdwebClient, prepareTransaction, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Card } from "tw-components";

interface DepositNativeProps {
  address: string;
  symbol: string;
  chain: StoredChain;
  isLoggedIn: boolean;
  client: ThirdwebClient;
}

export const DepositNative: React.FC<DepositNativeProps> = ({
  address,
  symbol,
  chain,
  isLoggedIn,
  client,
}) => {
  const { mutate: transfer, isPending } = useSendAndConfirmTransaction();
  const [amount, setAmount] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };
  const v5Chain = useV5DashboardChain(chain.chainId);

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
      maxW={{ base: "100%", md: "49%" }}
    >
      <Input
        placeholder={`Amount in ${symbol}. ex: 0.001`}
        onChange={handleChange}
        type="number"
        value={amount}
      />
      <TransactionButton
        client={client}
        isLoggedIn={isLoggedIn}
        txChainID={v5Chain.id}
        transactionCount={1}
        isPending={isPending}
        disabled={
          amount.length === 0 || Number.parseFloat(amount) <= 0 || !address
        }
        onClick={() => {
          if (!address) {
            throw new Error("Invalid address");
          }

          const transaction = prepareTransaction({
            to: address,
            chain: v5Chain,
            client,
            value: toWei(amount),
          });
          transfer(transaction, {
            onSuccess: () => {
              setAmount("");
            },
          });
        }}
        style={{ minWidth: 160 }}
      >
        Deposit
      </TransactionButton>
    </Card>
  );
};
