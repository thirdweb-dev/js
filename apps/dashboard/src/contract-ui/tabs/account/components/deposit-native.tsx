import { Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { thirdwebClient } from "lib/thirdweb-client";
import { type ChangeEvent, useState } from "react";
import { prepareTransaction, toWei } from "thirdweb";
import {
  useActiveWalletChain,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Card } from "tw-components";

interface DepositNativeProps {
  address: string;
  symbol: string;
}

export const DepositNative: React.FC<DepositNativeProps> = ({
  address,
  symbol,
}) => {
  const chain = useActiveWalletChain();
  const { mutate: transfer, isPending } = useSendAndConfirmTransaction();
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
        isLoading={isPending}
        isDisabled={
          amount.length === 0 ||
          Number.parseFloat(amount) <= 0 ||
          !address ||
          !chain
        }
        colorScheme="primary"
        onClick={() => {
          if (!address) {
            throw new Error("Invalid address");
          }
          if (!chain) {
            throw new Error("Invalid chain");
          }
          const transaction = prepareTransaction({
            to: address,
            chain,
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
