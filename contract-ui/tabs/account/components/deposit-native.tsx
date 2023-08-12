import { useTransferNativeToken } from "@3rdweb-sdk/react/hooks/useTransferNativeToken";
import { Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import React, { ChangeEvent, useState } from "react";
import { Card } from "tw-components";

interface DepositNativeProps {
  address: string;
  symbol: string;
}

export const DepositNative: React.FC<DepositNativeProps> = ({
  address,
  symbol,
}) => {
  const { mutate: transfer, isLoading } = useTransferNativeToken();
  const [amount, setAmount] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };

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
        transactionCount={1}
        isLoading={isLoading}
        isDisabled={amount.length === 0 || parseFloat(amount) <= 0}
        colorScheme="primary"
        onClick={() =>
          transfer(
            { address, amount },
            {
              onSuccess: () => {
                setAmount("");
              },
            },
          )
        }
        style={{ minWidth: 160 }}
      >
        Deposit
      </TransactionButton>
    </Card>
  );
};
