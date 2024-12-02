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
import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { Flame } from "lucide-react";
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
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface TokenBurnButtonProps {
  contract: ThirdwebContract;
}

const BURN_FORM_ID = "token-burn-form";

export const TokenBurnButton: React.FC<TokenBurnButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;

  const tokenBalanceQuery = useReadContract(ERC20Ext.balanceOf, {
    contract,
    address: address || "",
    queryOptions: { enabled: !!address },
  });

  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;
  const [open, setOpen] = useState(false);
  const sendConfirmation = useSendAndConfirmTransaction();
  const trackEvent = useTrack();
  const form = useForm({ defaultValues: { amount: "0" } });
  const decimalsQuery = useReadContract(ERC20Ext.decimals, { contract });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="primary"
          {...restButtonProps}
          disabled={!hasBalance}
          className="gap-2"
        >
          <Flame size={16} /> Burn
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000]">
        <SheetHeader>
          <SheetTitle className="text-left">Burn tokens</SheetTitle>
        </SheetHeader>
        <form className="mt-10 flex flex-col gap-3">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isRequired isInvalid={!!form.formState.errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${decimalsQuery.data || 18}})?$`}
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
            txChainID={contract.chain.id}
            transactionCount={1}
            form={BURN_FORM_ID}
            isPending={sendConfirmation.isPending}
            type="submit"
            disabled={!form.formState.isDirty}
            onClick={form.handleSubmit((data) => {
              if (address) {
                trackEvent({
                  category: "token",
                  action: "burn",
                  label: "attempt",
                });

                // TODO: burn should be updated to take amount / amountWei (v6?)
                const tx = ERC20Ext.burn({
                  contract,
                  asyncParams: async () => {
                    return {
                      amount: toUnits(
                        data.amount,
                        await ERC20Ext.decimals({ contract }),
                      ),
                    };
                  },
                });

                const promise = sendConfirmation.mutateAsync(tx, {
                  onSuccess: () => {
                    trackEvent({
                      category: "token",
                      action: "burn",
                      label: "success",
                    });
                    form.reset({ amount: "0" });
                    setOpen(false);
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "token",
                      action: "burn",
                      label: "error",
                      error,
                    });
                    console.error(error);
                  },
                });
                toast.promise(promise, {
                  loading: `Burning ${data.amount} token(s)`,
                  success: "Tokens burned successfully",
                  error: "Failed to burn tokens",
                });
              }
            })}
          >
            Burn Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
