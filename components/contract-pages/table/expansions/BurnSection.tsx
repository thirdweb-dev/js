import { useTableContext } from "../table-context";
import { useBurnMutation } from "@3rdweb-sdk/react";
import {
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Edition, EditionDrop, ValidContractInstance } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaBurn } from "react-icons/fa";
import { FormHelperText, FormLabel } from "tw-components";

interface IBurnSection {
  contract?: ValidContractInstance;
  tokenId: string;
}

export const BurnSection: React.FC<IBurnSection> = ({ contract, tokenId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { to: "", amount: "1" },
  });

  const burn = useBurnMutation(contract);
  const { closeAllRows } = useTableContext();

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );

  const onSubmit = useCallback(
    (data) => {
      burn.mutate(
        {
          tokenId,
          amount: data.amount,
        },
        {
          onError,
          onSuccess: () => {
            onSuccess();
            closeAllRows();
          },
        },
      );
    },
    [burn, tokenId, onError, onSuccess, closeAllRows],
  );

  const requiresAmount =
    contract instanceof Edition || contract instanceof EditionDrop;

  return (
    <Stack pt={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack align="center">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            {requiresAmount && (
              <FormControl isRequired={requiresAmount} isInvalid={!!errors.to}>
                <FormLabel>Amount</FormLabel>
                <Input placeholder={"1"} {...register("amount")} />
                <FormHelperText>
                  How many would you like to burn?
                </FormHelperText>
                <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
          <TransactionButton
            transactionCount={1}
            isLoading={burn.isLoading}
            type="submit"
            colorScheme="primary"
            rightIcon={<Icon as={FaBurn} />}
          >
            Burn
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
