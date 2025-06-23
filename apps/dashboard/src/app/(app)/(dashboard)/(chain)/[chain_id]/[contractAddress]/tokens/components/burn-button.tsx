"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { FlameIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, toUnits } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
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

interface TokenBurnButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const BURN_FORM_ID = "token-burn-form";

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
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

  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;
  const [open, setOpen] = useState(false);
  const sendConfirmation = useSendAndConfirmTransaction();
  const form = useForm({ defaultValues: { amount: "0" } });
  const decimalsQuery = useReadContract(ERC20Ext.decimals, { contract });

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button
          variant="primary"
          {...restButtonProps}
          className="gap-2"
          disabled={!hasBalance}
        >
          <FlameIcon className="size-4" /> Burn
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Burn tokens</SheetTitle>
        </SheetHeader>
        <form className="mt-10 flex flex-col gap-3">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isInvalid={!!form.formState.errors.amount} isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                pattern={`^\\d+(\\.\\d{1,${decimalsQuery.data || 18}})?$`}
                type="text"
                {...form.register("amount")}
              />
              <FormHelperText>How many would you like to burn?</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </div>
          <Text>
            Burning these{" "}
            {`${Number.parseInt(form.watch("amount")) > 1 ? form.watch("amount") : ""} `}
            tokens will remove them from the total circulating supply. This
            action is irreversible.
          </Text>
        </form>
        <SheetFooter className="mt-10">
          <TransactionButton
            client={contract.client}
            disabled={!form.formState.isDirty}
            form={BURN_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={sendConfirmation.isPending}
            onClick={form.handleSubmit((data) => {
              if (address) {
                // TODO: burn should be updated to take amount / amountWei (v6?)
                const tx = ERC20Ext.burn({
                  asyncParams: async () => {
                    return {
                      amount: toUnits(
                        data.amount,
                        await ERC20Ext.decimals({ contract }),
                      ),
                    };
                  },
                  contract,
                });

                const promise = sendConfirmation.mutateAsync(tx, {
                  onError: (error) => {
                    console.error(error);
                  },
                  onSuccess: () => {
                    form.reset({ amount: "0" });
                    setOpen(false);
                  },
                });
                toast.promise(promise, {
                  error: "Failed to burn tokens",
                  loading: `Burning ${data.amount} token(s)`,
                  success: "Tokens burned successfully",
                });
              }
            })}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Burn Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
