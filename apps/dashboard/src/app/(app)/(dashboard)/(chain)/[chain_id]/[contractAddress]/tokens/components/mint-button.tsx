"use client";

import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { FormErrorMessage, FormLabel } from "tw-components";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TokenMintButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const MINT_FORM_ID = "token-mint-form";

/**
 * This component is for minting tokens to a TokenERC20 contract (NOT DropERC20)
 */
export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
  contract,
  isLoggedIn,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  const address = useActiveAccount()?.address;
  const { data: tokenDecimals } = useReadContract(ERC20Ext.decimals, {
    contract,
  });
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();
  const form = useForm({ defaultValues: { amount: "0" } });
  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button variant="primary" {...restButtonProps} className="gap-2">
            <PlusIcon size={16} /> Mint
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              Mint additional tokens
            </SheetTitle>
          </SheetHeader>
          <form
            className="mt-10 flex flex-col gap-6"
            id={MINT_FORM_ID}
            onSubmit={form.handleSubmit((d) => {
              if (!address) {
                return toast.error("No wallet connected");
              }
              const transaction = ERC20Ext.mintTo({
                amount: d.amount,
                contract,
                to: address,
              });
              const promise = sendAndConfirmTransaction.mutateAsync(
                transaction,
                {
                  onError: (error) => {
                    console.error(error);
                  },
                  onSuccess: () => {
                    form.reset({ amount: "0" });
                    setOpen(false);
                  },
                },
              );
              toast.promise(promise, {
                error: "Failed to mint tokens",
                loading: "Minting tokens",
                success: "Tokens minted successfully",
              });
            })}
          >
            <FormControl isInvalid={!!form.formState.errors.amount} isRequired>
              <FormLabel>Additional Supply</FormLabel>
              <Input
                pattern={`^\\d+(\\.\\d{1,${tokenDecimals || 18}})?$`}
                type="text"
                {...form.register("amount")}
              />
              <FormErrorMessage>
                {form.formState.errors?.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </form>
          <SheetFooter className="mt-10">
            <TransactionButton
              client={contract.client}
              disabled={!form.formState.isDirty}
              form={MINT_FORM_ID}
              isLoggedIn={isLoggedIn}
              isPending={sendAndConfirmTransaction.isPending}
              transactionCount={1}
              txChainID={contract.chain.id}
              type="submit"
            >
              Mint Tokens
            </TransactionButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
