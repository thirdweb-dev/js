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
import type { ThirdwebContract } from "thirdweb";
import { decimals, mintTo } from "thirdweb/extensions/erc20";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Button, FormErrorMessage, FormLabel, Heading } from "tw-components";

const MINT_FORM_ID = "token-mint-form";
interface TokenMintFormProps {
  contract: ThirdwebContract;
}

export const TokenERC20MintForm: React.FC<TokenMintFormProps> = ({
  contract,
}) => {
  const address = useActiveAccount()?.address;
  const { data: tokenDecimals } = useReadContract(decimals, { contract });
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({ defaultValues: { amount: "0" } });
  const modalContext = useModalContext();
  const { onSuccess, onError } = useTxNotifications(
    "Tokens minted successfully",
    "Failed to mint tokens",
    contract,
  );
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
              const transaction = mintTo({
                contract,
                amount: d.amount,
                to: address,
              });
              mutate(transaction, {
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
              });
            }
          })}
        >
          <FormControl isRequired isInvalid={!!errors.amount}>
            <FormLabel>Additional Supply</FormLabel>
            <Input
              type="text"
              pattern={`^\\d+(\\.\\d{1,${tokenDecimals || 18}})?$`}
              {...register("amount")}
            />
            <FormErrorMessage>{errors?.amount?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={isPending}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          transactionCount={1}
          isLoading={isPending}
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
