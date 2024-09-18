import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormControl, Icon, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
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

interface TokenTransferButtonProps {
  contract: ThirdwebContract;
}

const TRANSFER_FORM_ID = "token-transfer-form";

export const TokenTransferButton: React.FC<TokenTransferButtonProps> = ({
  contract,
  ...restButtonProps
}) => {
  const address = useActiveAccount()?.address;
  const tokenBalanceQuery = useReadContract(ERC20Ext.balanceOf, {
    contract,
    address: address || "",
    queryOptions: { enabled: !!address },
  });
  const trackEvent = useTrack();
  const form = useForm({ defaultValues: { amount: "0", to: "" } });
  const hasBalance = tokenBalanceQuery.data && tokenBalanceQuery.data > 0n;
  const { onSuccess, onError } = useTxNotifications(
    "Successfully transferred tokens",
    "Failed to transfer tokens",
    contract,
  );

  const decimalsQuery = useReadContract(ERC20Ext.decimals, { contract });
  const sendConfirmation = useSendAndConfirmTransaction();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          colorScheme="primary"
          leftIcon={<Icon as={FiSend} />}
          {...restButtonProps}
          isDisabled={!hasBalance}
        >
          Transfer
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000]">
        <SheetHeader>
          <SheetTitle>Transfer tokens</SheetTitle>
        </SheetHeader>
        <form className="mt-10">
          <div className="flex flex-col gap-6">
            <FormControl isRequired isInvalid={!!form.formState.errors.to}>
              <FormLabel>To Address</FormLabel>
              <SolidityInput
                formContext={form}
                solidityType="address"
                placeholder={ZERO_ADDRESS}
                {...form.register("to")}
              />
              <FormHelperText>Enter the address to transfer to.</FormHelperText>
              <FormErrorMessage>
                {form.formState.errors.to?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!form.formState.errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${decimalsQuery.data || 18}})?$`}
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
            transactionCount={1}
            form={TRANSFER_FORM_ID}
            isLoading={sendConfirmation.isPending}
            type="submit"
            colorScheme="primary"
            isDisabled={!form.formState.isDirty}
            onClick={form.handleSubmit((d) => {
              trackEvent({
                category: "token",
                action: "transfer",
                label: "attempt",
              });
              const transaction = ERC20Ext.transfer({
                contract,
                amount: d.amount,
                to: d.to,
              });
              sendConfirmation.mutate(transaction, {
                onSuccess: () => {
                  trackEvent({
                    category: "token",
                    action: "transfer",
                    label: "success",
                  });
                  form.reset({ amount: "0", to: "" });
                  onSuccess();
                  setOpen(false);
                },
                onError: (error) => {
                  trackEvent({
                    category: "token",
                    action: "transfer",
                    label: "error",
                    error,
                  });
                  onError(error);
                },
              });
            })}
          >
            Transfer Tokens
          </TransactionButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
