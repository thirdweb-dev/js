"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { transferFrom } from "thirdweb/extensions/erc721";
import { isERC1155, safeTransferFrom } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";

interface TransferTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

const TransferTab: React.FC<TransferTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
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

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={form.handleSubmit((data) => {
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
        })}
      >
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isInvalid={!!form.formState.errors.to} isRequired>
              <FormLabel>To Address</FormLabel>
              <SolidityInput
                client={contract.client}
                formContext={form}
                placeholder={ZERO_ADDRESS}
                solidityType="address"
                {...form.register("to")}
              />
              <FormHelperText>Enter the address to transfer to.</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.to?.message}
              </FormErrorMessage>
            </FormControl>
            {isErc1155 && (
              <FormControl
                isInvalid={!!form.formState.errors.to}
                isRequired={isErc1155}
              >
                <FormLabel>Amount</FormLabel>
                <Input placeholder="1" {...form.register("amount")} />
                <FormHelperText>
                  How many would you like to transfer?
                </FormHelperText>
                <FormErrorMessage>
                  {form.formState.errors.to?.message}
                </FormErrorMessage>
              </FormControl>
            )}
          </div>
          <TransactionButton
            className="self-end"
            client={contract.client}
            disabled={
              !form.formState.isDirty ||
              checking1155 ||
              sendTxAndConfirm.isPending ||
              !account
            }
            isLoggedIn={isLoggedIn}
            isPending={sendTxAndConfirm.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Transfer
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};

export default TransferTab;
