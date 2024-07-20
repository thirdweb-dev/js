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
  type TokenContract,
  useClaimToken,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { useActiveAccount } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const CLAIM_FORM_ID = "token-claim-form";
interface TokenClaimFormProps {
  contract: TokenContract;
}

export const TokenClaimForm: React.FC<TokenClaimFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const claim = useClaimToken(contract);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { amount: "0", to: address } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Tokens claimed successfully",
    "Failed to claim tokens",
    contract,
  );

  const decimals = useTokenDecimals(contract);

  return (
    <>
      <DrawerHeader>
        <Heading>Claim tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack gap={3} as="form">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>To Address</FormLabel>
              <Input
                placeholder={constants.AddressZero}
                {...register("to", { required: true })}
              />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                pattern={`^\\d+(\\.\\d{1,${decimals?.data || 18}})?$`}
                {...register("amount", { required: true })}
              />
              <FormHelperText>How many would you like to claim?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          transactionCount={1}
          form={CLAIM_FORM_ID}
          isLoading={claim.isLoading}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
          onClick={handleSubmit((d) => {
            if (d.to) {
              trackEvent({
                category: "token",
                action: "claim",
                label: "attempt",
              });
              claim.mutate(
                { amount: d.amount, to: d.to },
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "token",
                      action: "claim",
                      label: "success",
                    });
                    onSuccess();
                    modalContext.onClose();
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "token",
                      action: "claim",
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
          Claim Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
