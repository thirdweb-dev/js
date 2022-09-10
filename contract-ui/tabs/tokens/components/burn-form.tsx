import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import {
  useAddress,
  useBurnToken,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import type { Erc20 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";

const BURN_FORM_ID = "token-burn-form";
interface TokenBurnFormProps {
  contract?: Erc20;
}

export const TokenBurnForm: React.FC<TokenBurnFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useAddress();
  const burn = useBurnToken(contract);
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
  );

  const decimals = useTokenDecimals(contract);

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
                pattern={`^\\d+(\\.\\d{1,${decimals?.data || 18}})?$`}
                {...register("amount")}
              />
              <FormHelperText>How many would you like to burn?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Text>
            Burning these{" "}
            {`${parseInt(watch("amount")) > 1 ? watch("amount") : ""} `}tokens
            will remove them from the total circulating supply. This action is
            irreversible.
          </Text>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          transactionCount={1}
          form={BURN_FORM_ID}
          isLoading={burn.isLoading}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
          onClick={handleSubmit((d) => {
            if (address) {
              trackEvent({
                category: "token",
                action: "burn",
                label: "attempt",
              });
              burn.mutate(
                { amount: d.amount },
                {
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
                },
              );
            }
          })}
        >
          Burn Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
