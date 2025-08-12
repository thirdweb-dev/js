"use client";

import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { transferFrom } from "thirdweb/extensions/erc721";
import { isERC1155, safeTransferFrom } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { SolidityInput } from "@/components/solidity-inputs";
import { TransactionButton } from "@/components/tx-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTxNotifications } from "@/hooks/useTxNotifications";

type TransferTabProps = {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
};

function TransferTab({ contract, tokenId, isLoggedIn }: TransferTabProps) {
  const account = useActiveAccount();

  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: "" },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Transfer successful",
    "Error transferring",
    contract,
  );

  const { data: isErc1155, isPending: checking1155 } = useReadContract(
    isERC1155,
    { contract },
  );

  const sendTxAndConfirm = useSendAndConfirmTransaction();

  if (checking1155) {
    return <GenericLoadingPage />;
  }

  function onSubmit(data: { to: string; amount: string }) {
    const transaction = isErc1155
      ? safeTransferFrom({
          contract,
          data: "0x",
          from: account?.address ?? "",
          to: data.to,
          tokenId: BigInt(tokenId),
          value: BigInt(data.amount),
        })
      : transferFrom({
          contract,
          from: account?.address ?? "",
          to: data.to,
          tokenId: BigInt(tokenId),
        });
    sendTxAndConfirm.mutate(transaction, {
      onError: (error) => {
        onError(error);
      },
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="to"
          rules={{
            required: "To address is required",
          }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>To Address</FormLabel>
              <FormControl>
                <SolidityInput
                  client={contract.client}
                  formContext={form}
                  className="bg-card"
                  placeholder="0x..."
                  solidityType="address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isErc1155 && (
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <TransactionButton
          className="self-end"
          client={contract.client}
          disabled={checking1155 || sendTxAndConfirm.isPending}
          isLoggedIn={isLoggedIn}
          isPending={sendTxAndConfirm.isPending}
          transactionCount={1}
          txChainID={contract.chain.id}
          type="submit"
        >
          Transfer
        </TransactionButton>
      </form>
    </Form>
  );
}

export default TransferTab;
