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
  TokenContract,
  useAddress,
  useMintToken,
  useTokenDecimals,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormErrorMessage, FormLabel, Heading } from "tw-components";

const MINT_FORM_ID = "token-mint-form";
interface TokenMintFormProps {
  contract: TokenContract;
}

export const TokenMintForm: React.FC<TokenMintFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useAddress();
  const mint = useMintToken(contract);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { amount: "0" } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Tokens minted successfully",
    "Failed to mint tokens",
  );

  const decimals = useTokenDecimals(contract);

  return (
    <>
      <DrawerHeader>
        <Heading>Mint additional tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit((d) => {
            if (address) {
              trackEvent({
                category: "token",
                action: "mint",
                label: "attempt",
              });
              mint.mutate(
                { amount: d.amount, to: address },
                {
                  onSuccess: () => {
                    trackEvent({
                      category: "token",
                      action: "mint",
                      label: "success",
                    });
                    onSuccess();
                    modalContext.onClose();
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "token",
                      action: "mint",
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
          <FormControl isRequired isInvalid={!!errors.amount}>
            <FormLabel>Additional Supply</FormLabel>
            <Input
              type="text"
              pattern={`^\\d+(\\.\\d{1,${decimals?.data || 18}})?$`}
              {...register("amount")}
            />
            <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={mint.isLoading}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          transactionCount={1}
          isLoading={mint.isLoading}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
          isDisabled={!isDirty}
        >
          Mint Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
