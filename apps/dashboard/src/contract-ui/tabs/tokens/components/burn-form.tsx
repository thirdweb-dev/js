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
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { type ThirdwebContract, toUnits } from "thirdweb";
import { burn, decimals } from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

const BURN_FORM_ID = "token-burn-form";
interface TokenBurnFormProps {
  contract: ThirdwebContract;
}

export const TokenBurnForm: React.FC<TokenBurnFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { amount: "0" } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Tokens burned successfully",
    "Failed to burn tokens",
    contract,
  );

  const decimalsQuery = useReadContract(decimals, { contract });
  const sendTransaction = useSendAndConfirmTransaction();

  return (
    <>
      <DrawerHeader>
        <Heading>Burn tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap={3} as="form">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${decimalsQuery.data || 18}})?$`}
                {...register("amount")}
              />
              <FormHelperText>How many would you like to burn?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Text>
            Burning these{" "}
            {`${Number.parseInt(watch("amount")) > 1 ? watch("amount") : ""} `}
            tokens will remove them from the total circulating supply. This
            action is irreversible.
          </Text>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          transactionCount={1}
          form={BURN_FORM_ID}
          isLoading={sendTransaction.isPending}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
          onClick={handleSubmit((data) => {
            if (address) {
              trackEvent({
                category: "token",
                action: "burn",
                label: "attempt",
              });

              // TODO: burn should be updated to take amount / amountWei (v6?)
              const tx = burn({
                contract,
                asyncParams: async () => {
                  return {
                    amount: toUnits(data.amount, await decimals({ contract })),
                  };
                },
              });

              sendTransaction.mutate(tx, {
                onSuccess: () => {
                  trackEvent({
                    category: "token",
                    action: "burn",
                    label: "success",
                  });
                  onSuccess();
                  modalContext.onClose();
                },
                onError: (error) => {
                  trackEvent({
                    category: "token",
                    action: "burn",
                    label: "error",
                    error,
                  });
                  onError(error);
                },
              });
            }
          })}
        >
          Burn Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
