"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MinterOnly } from "@3rdweb-sdk/react/components/roles/minter-only";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
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

interface TokenMintButtonProps {
  contract: ThirdwebContract;
  account: Account | undefined;
}

const MINT_FORM_ID = "token-mint-form";

/**
 * This component is for minting tokens to a TokenERC20 contract (NOT DropERC20)
 */
export const TokenMintButton: React.FC<TokenMintButtonProps> = ({
  contract,
  account,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  const address = useActiveAccount()?.address;
  const { data: tokenDecimals } = useReadContract(ERC20Ext.decimals, {
    contract,
  });
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();
  const trackEvent = useTrack();
  const form = useForm({ defaultValues: { amount: "0" } });
  return (
    <MinterOnly contract={contract}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="primary" {...restButtonProps} className="gap-2">
            <PlusIcon size={16} /> Mint
          </Button>
        </SheetTrigger>
        <SheetContent className="z-[10000]">
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
              trackEvent({
                category: "token",
                action: "mint",
                label: "attempt",
              });
              const transaction = ERC20Ext.mintTo({
                contract,
                amount: d.amount,
                to: address,
              });
              const promise = sendAndConfirmTransaction.mutateAsync(
                transaction,
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "token",
                      action: "mint",
                      label: "success",
                    });
                    form.reset({ amount: "0" });
                    setOpen(false);
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "token",
                      action: "mint",
                      label: "error",
                      error,
                    });
                    console.error(error);
                  },
                },
              );
              toast.promise(promise, {
                loading: "Minting tokens",
                success: "Tokens minted successfully",
                error: "Failed to mint tokens",
              });
            })}
          >
            <FormControl isRequired isInvalid={!!form.formState.errors.amount}>
              <FormLabel>Additional Supply</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${tokenDecimals || 18}})?$`}
                {...form.register("amount")}
              />
              <FormErrorMessage>
                {form.formState.errors?.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </form>
          <SheetFooter className="mt-10">
            <TransactionButton
              twAccount={account}
              txChainID={contract.chain.id}
              transactionCount={1}
              isPending={sendAndConfirmTransaction.isPending}
              form={MINT_FORM_ID}
              type="submit"
              disabled={!form.formState.isDirty}
            >
              Mint Tokens
            </TransactionButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
};
