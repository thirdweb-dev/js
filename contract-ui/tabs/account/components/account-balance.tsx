import { walletKeys } from "@3rdweb-sdk/react";
import {
  Flex,
  Input,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSDK } from "@thirdweb-dev/react";
import { CurrencyValue } from "@thirdweb-dev/sdk/evm";
import { TransactionButton } from "components/buttons/TransactionButton";
import { add, parse } from "date-fns";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import invariant from "tiny-invariant";
import { Button, Card } from "tw-components";

interface AccountBalanceProps {
  address: string;
}

type TransferInput = {
  address: string;
  amount: string;
};

function useTransfer() {
  const sdk = useSDK();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TransferInput) => {
      invariant(sdk, "SDK is not initialized");
      await sdk.wallet.transfer(input.address, input.amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(walletKeys.balances(variables.address));
    },
  });
}

function useBalance(address: string) {
  const sdk = useSDK();
  return useQuery(walletKeys.balances(address), async () => {
    invariant(sdk, "SDK is not initialized");
    return await sdk.getBalance(address);
  });
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ address }) => {
  const { data: balance } = useBalance(address);
  const { mutate: transfer, isLoading } = useTransfer();
  const [amount, setAmount] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value);
  };

  return (
    <SimpleGrid spacing={{ base: 3, md: 6 }} columns={{ base: 1, md: 2 }}>
      <Card as={Stat}>
        <StatLabel mb={{ base: 1, md: 0 }}>{balance?.symbol}</StatLabel>
        <StatNumber>{balance?.displayValue}</StatNumber>
      </Card>
      <Card
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
        }}
      >
        <Input
          placeholder={`Amount in ${balance?.symbol}. ex: 0.001`}
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
    </SimpleGrid>
  );
};
