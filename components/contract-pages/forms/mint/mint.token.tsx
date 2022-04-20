import { IMintFormProps } from "./types";
import { useTokenMintMutation } from "@3rdweb-sdk/react";
import {
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Stack,
  useModalContext,
} from "@chakra-ui/react";
import { Token } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { MismatchButton } from "components/buttons/MismatchButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";

const MINT_FORM_ID = "token-mint-form";
interface ITokenMintForm extends IMintFormProps {
  contract: Token;
}

export const TokenMintForm: React.FC<ITokenMintForm> = ({ contract }) => {
  const mint = useTokenMintMutation(contract);
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
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={MINT_FORM_ID}
          onSubmit={handleSubmit((d) =>
            mint.mutate(d.amount, {
              onSuccess: () => {
                onSuccess();
                modalContext.onClose();
              },
              onError,
            }),
          )}
        >
          <FormControl isRequired isInvalid={!!errors.amount}>
            <FormLabel>Additional Supply</FormLabel>
            <Input
              type="number"
              step="1"
              pattern="[0-9]"
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
        <MismatchButton
          isLoading={mint.isLoading}
          leftIcon={<Icon as={FiPlus} />}
          form={MINT_FORM_ID}
          type="submit"
          colorScheme="primary"
        >
          Mint Tokens
        </MismatchButton>
      </DrawerFooter>
    </>
  );
};
