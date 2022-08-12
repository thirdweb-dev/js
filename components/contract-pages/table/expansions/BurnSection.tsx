import { useTableContext } from "../table-context";
import { FormControl, Icon, Input, Stack } from "@chakra-ui/react";
import { NFTContract, useBurnNFT } from "@thirdweb-dev/react";
import { Edition, EditionDrop, ValidContractInstance } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { FaBurn } from "react-icons/fa";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface IBurnSection {
  contract?: ValidContractInstance;
  tokenId: string;
}

export const BurnSection: React.FC<IBurnSection> = ({ contract, tokenId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: string }>({
    defaultValues: { amount: "1" },
  });

  const burn = useBurnNFT(contract as NFTContract);
  const { closeAllRows } = useTableContext();

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );

  const requiresAmount =
    contract instanceof Edition || contract instanceof EditionDrop;

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
            {requiresAmount && (
              <FormControl
                isRequired={requiresAmount}
                isInvalid={!!errors.amount}
              >
                <FormLabel>Amount</FormLabel>
                <Input placeholder={"1"} {...register("amount")} />
                <FormHelperText>
                  How many would you like to burn?
                </FormHelperText>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
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
