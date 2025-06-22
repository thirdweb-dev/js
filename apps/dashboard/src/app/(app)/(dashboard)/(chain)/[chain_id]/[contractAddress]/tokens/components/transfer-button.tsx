"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { SolidityInput } from "@/components/solidity-inputs";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TokenTransferButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const TRANSFER_FORM_ID = "token-transfer-form";

export const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
  contract,
  isLoggedIn,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const tokenBalanceQuery = useReadContract(ERC20Ext.balanceOf, {
    address: address || "",
    contract,
    queryOptions: { enabled: !!address },
  });
  const form = useForm({ defaultValues: { amount: "0", to: "" } });
  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;
  const decimalsQuery = useReadContract(ERC20Ext.decimals, { contract });
  const sendConfirmation = useSendAndConfirmTransaction();
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          variant="primary"
          {...restButtonProps}
          className="gap-2"
          disabled={!hasBalance}
        >
          <SendIcon size={16} /> Transfer
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Transfer tokens</SheetTitle>
        </SheetHeader>
        <form className="mt-10">
          <div className="flex flex-col gap-6">
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
            <FormControl isInvalid={!!form.formState.errors.amount} isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                pattern={`^\\d+(\\.\\d{1,${decimalsQuery.data || 18}})?$`}
                type="text"
                {...form.register("amount")}
              />
              <FormHelperText>
                How many would you like to transfer?
              </FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </div>
        </form>
        <SheetFooter className="mt-10">
          <TransactionButton
            client={contract.client}
            disabled={!form.formState.isDirty}
            form={TRANSFER_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={sendConfirmation.isPending}
            onClick={form.handleSubmit((d) => {
              const transaction = ERC20Ext.transfer({
                amount: d.amount,
                contract,
                to: d.to,
              });
              const promise = sendConfirmation.mutateAsync(transaction, {
                onError: (error) => {
                  console.error(error);
                },
                onSuccess: () => {
                  form.reset({ amount: "0", to: "" });
                  setOpen(false);
                },
              });
              toast.promise(promise, {
                error: "Failed to transfer tokens",
                loading: "Transferring tokens",
                success: "Successfully transferred tokens",
              });
            })}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Transfer Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
