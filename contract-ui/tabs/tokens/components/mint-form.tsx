import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import { useAddress, useMintToken } from "@thirdweb-dev/react";
import type { Erc20 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, FormErrorMessage, FormLabel, Heading } from "tw-components";

const MINT_FORM_ID = "token-mint-form";
interface TokenMintFormProps {
  contract: Erc20;
}

export const TokenMintForm: React.FC<TokenMintFormProps> = ({ contract }) => {
  const address = useAddress();
  const mint = useMintToken(contract);
  console.log(address);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { amount: "0" } });
  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "Tokens minted successfully",
    "Failed to mint tokens",
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
              mint.mutate(
                { amount: d.amount, to: address },
                {
                  onSuccess: () => {
                    onSuccess();
                    modalContext.onClose();
                  },
                  onError,
                },
              );
            }
          })}
        >
          <FormControl isRequired isInvalid={!!errors.amount}>
            <FormLabel>Additional Supply</FormLabel>
            <Input
              type="number"
              step="1"
              pattern="/(\.)?\d+(\.\d*)?/g"
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
        >
          Mint Tokens
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
