import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { decimals, transfer } from "thirdweb/extensions/erc20";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const TRANSFER_FORM_ID = "token-transfer-form";

interface TokenTransferFormProps {
  contract: ThirdwebContract;
}

export const TokenTransferForm: React.FC<TokenTransferFormProps> = ({
  contract,
}) => {
  const trackEvent = useTrack();

  const form = useForm({ defaultValues: { amount: "0", to: "" } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Successfully transferred tokens",
    "Failed to transfer tokens",
    contract,
  );

  const decimalsQuery = useReadContract(decimals, { contract });

  const sendConfirmation = useSendAndConfirmTransaction();

  return (
    <>
      <DrawerHeader>
        <Heading>Transfer tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap={3} as="form">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!form.formState.errors.to}>
              <FormLabel>To Address</FormLabel>
              <SolidityInput
                formContext={form}
                solidityType="address"
                placeholder={constants.AddressZero}
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
          </Stack>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
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
            const transaction = transfer({
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
                onSuccess();
                modalContext.onClose();
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
      </DrawerFooter>
    </>
  );
};
