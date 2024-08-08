import { Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { type ChangeEvent, useState } from "react";
import { prepareTransaction, toWei } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { Card } from "tw-components";
import type { StoredChain } from "../../../../contexts/configured-chains";
import { useV5DashboardChain } from "../../../../lib/v5-adapter";

interface DepositNativeProps {
  address: string;
  symbol: string;
  chain: StoredChain;
}

export const DepositNative: React.FC<DepositNativeProps> = ({
  address,
  symbol,
  chain,
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
        transactionCount={1}
        isLoading={isPending}
        isDisabled={
          amount.length === 0 || Number.parseFloat(amount) <= 0 || !address
        }
        colorScheme="primary"
        onClick={() => {
          if (!address) {
            throw new Error("Invalid address");
          }

          const transaction = prepareTransaction({
            to: address,
            chain: v5Chain,
            client: thirdwebClient,
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
