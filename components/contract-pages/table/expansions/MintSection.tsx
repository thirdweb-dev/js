import { useTableContext } from "../table-context";
import { useEditionMintSupplyMutation } from "@3rdweb-sdk/react";
import { FormControl, Icon, Input, Stack } from "@chakra-ui/react";
import { Edition } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { ImStack } from "react-icons/im";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface IMintSection {
  contract?: Edition;
  tokenId: string;
}

export const MintSection: React.FC<IMintSection> = ({ contract, tokenId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: string }>({
    defaultValues: { amount: "1" },
  });

  const burn = useEditionMintSupplyMutation(contract);
  const { closeAllRows } = useTableContext();

  const { onSuccess, onError } = useTxNotifications(
    "Mint successful",
    "Error minting additional supply",
  );

  return (
    <Stack pt={3}>
      <form
        onSubmit={handleSubmit((data) => {
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
        })}
      >
        <Stack align="center">
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input placeholder={"1"} {...register("amount")} />
              <FormHelperText>
                How many tokens would you like to mint?
              </FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
          <TransactionButton
            transactionCount={1}
            isLoading={burn.isLoading}
            type="submit"
            colorScheme="primary"
            rightIcon={<Icon as={ImStack} />}
          >
            Mint
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
