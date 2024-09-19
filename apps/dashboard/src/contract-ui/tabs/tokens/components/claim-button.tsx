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
import { Gem } from "lucide-react";
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
import {
  Button,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "tw-components";

interface TokenClaimButtonProps {
  contract: ThirdwebContract;
}

const CLAIM_FORM_ID = "token-claim-form";

export const TokenClaimButton: React.FC<TokenClaimButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const [open, setOpen] = useState(false);
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();
  const trackEvent = useTrack();
  const account = useActiveAccount();
  const form = useForm({
    defaultValues: { amount: "0", to: account?.address },
  });
  const { data: _decimals, isLoading } = useReadContract(ERC20Ext.decimals, {
    contract,
  });
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          colorScheme="primary"
          leftIcon={<Gem size={16} />}
          isDisabled={!account}
          {...restButtonProps}
        >
          Claim
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000]">
        <SheetHeader>
          <SheetTitle>Claim tokens</SheetTitle>
        </SheetHeader>
        <form>
          <div className="flex flex-col gap-6 mt-10">
            <FormControl isRequired isInvalid={!!form.formState.errors.to}>
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
            <FormControl isRequired isInvalid={!!form.formState.errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${_decimals || 18}})?$`}
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
            transactionCount={1}
            form={CLAIM_FORM_ID}
            isLoading={form.formState.isSubmitting}
            type="submit"
            colorScheme="primary"
            isDisabled={!form.formState.isDirty || isLoading}
            onClick={form.handleSubmit(async (d) => {
              if (!d.to) {
                return toast.error(
                  "Need to speficy an address to receive tokens",
                );
              }
              trackEvent({
                category: "token",
                action: "claim",
                label: "attempt",
              });
              if (!account) {
                return toast.error("No account detected");
              }
              const transaction = ERC20Ext.claimTo({
                contract,
                to: d.to,
                quantity: d.amount,
                from: account.address,
              });

              const approveTx = await ERC20Ext.getApprovalForTransaction({
                transaction,
                account,
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
                  loading: "Approving ERC20 tokens for this claim",
                  success: "Tokens approved successfully",
                  error: "Failed to approve token",
                });

                await promise;
              }

              const promise = sendAndConfirmTransaction.mutateAsync(
                transaction,
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "token",
                      action: "claim",
                      label: "success",
                    });
                    form.reset({ amount: "0", to: account?.address });
                    setOpen(false);
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "token",
                      action: "claim",
                      label: "error",
                      error,
                    });
                    console.error(error);
                  },
                },
              );

              toast.promise(promise, {
                loading: "Claiming tokens",
                success: "Token claimed successfully",
                error: "Failed to claim tokens",
              });
            })}
          >
            Claim Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
