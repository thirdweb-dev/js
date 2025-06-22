"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import { GemIcon } from "lucide-react";
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
import { useTxNotifications } from "@/hooks/useTxNotifications";

interface TokenClaimButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const CLAIM_FORM_ID = "token-claim-form";

export const TokenClaimButton: React.FC<TokenClaimButtonProps> = ({
  contract,
  isLoggedIn,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  const form = useForm({
    defaultValues: { amount: "0", to: account?.address },
  });
  const { data: _decimals, isPending } = useReadContract(ERC20Ext.decimals, {
    contract,
  });
  const claimTokensNotifications = useTxNotifications(
    "Tokens claimed successfully",
    "Failed to claim tokens",
  );
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="gap-2" variant="primary" {...restButtonProps}>
          <GemIcon size={16} /> Claim
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-left">Claim tokens</SheetTitle>
        </SheetHeader>
        <form>
          <div className="mt-10 flex flex-col gap-6">
            <FormControl isInvalid={!!form.formState.errors.to} isRequired>
              <FormLabel>To Address</FormLabel>
              <Input
                placeholder={ZERO_ADDRESS}
                {...form.register("to", { required: true })}
              />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.to?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!form.formState.errors.amount} isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                pattern={`^\\d+(\\.\\d{1,${_decimals || 18}})?$`}
                type="text"
                {...form.register("amount", { required: true })}
              />
              <FormHelperText>How many would you like to claim?</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.amount?.message}
              </FormErrorMessage>
            </FormControl>
          </div>
        </form>
        <SheetFooter className="mt-10">
          <TransactionButton
            client={contract.client}
            disabled={!form.formState.isDirty || isPending}
            form={CLAIM_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={form.formState.isSubmitting}
            onClick={form.handleSubmit(async (d) => {
              try {
                if (!d.to) {
                  return toast.error(
                    "Need to specify an address to receive tokens",
                  );
                }

                if (!account) {
                  return toast.error("No account detected");
                }
                const transaction = ERC20Ext.claimTo({
                  contract,
                  from: account.address,
                  quantity: d.amount,
                  to: d.to,
                });

                const approveTx = await ERC20Ext.getApprovalForTransaction({
                  account,
                  transaction,
                });

                if (approveTx) {
                  const promise = sendAndConfirmTransaction.mutateAsync(
                    approveTx,
                    {
                      onError: (error) => {
                        console.error(error);
                      },
                    },
                  );
                  toast.promise(promise, {
                    error: "Failed to approve token",
                    loading: "Approving ERC20 tokens for this claim",
                    success: "Tokens approved successfully",
                  });

                  await promise;
                }

                await sendAndConfirmTransaction.mutateAsync(transaction, {
                  onError: (error) => {
                    console.error(error);
                  },
                  onSuccess: () => {
                    form.reset({ amount: "0", to: account?.address });
                    setOpen(false);
                  },
                });

                claimTokensNotifications.onSuccess();
              } catch (error) {
                console.error(error);
                claimTokensNotifications.onError(error);
              }
            })}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Claim Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
