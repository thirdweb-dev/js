import { FormControl, Input, Stack } from "@chakra-ui/react";
import { NFTContract, useBurnNFT } from "@thirdweb-dev/react";
import { Erc721, Erc1155 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface BurnTabProps {
  contract: NFTContract | undefined;
  tokenId: string;
}

export const BurnTab: React.FC<BurnTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });

  const burn = useBurnNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );

  const requiresAmount = contract instanceof Erc1155;

  return (
    <Stack pt={3}>
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "burn",
            label: "attempt",
          });
          burn.mutate(
            {
              tokenId,
              amount: data.amount,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "burn",
                  label: "success",
                });
                onSuccess();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "burn",
                  label: "error",
                  error,
                });
                onError(error);
              },
            },
          );
        })}
      >
        <Stack gap={3}>
          {requiresAmount && (
            <Stack
              spacing={6}
              w="100%"
              direction={{ base: "column", md: "row" }}
            >
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
            </Stack>
          )}
          {contract instanceof Erc721 && (
            <Text>
              Burning this NFT will remove it from your wallet. The NFT data
              will continue to be accessible but no one will be able to claim
              ownership over it again. This action is irreversible.
            </Text>
          )}
          {contract instanceof Erc1155 && (
            <Text>
              Burning these{" "}
              {`${parseInt(watch("amount")) > 1 ? watch("amount") : ""} `}
              copies of the NFT will remove them them from your wallet. The NFT
              data will continue to be accessible but no one will be able to
              claim ownership over these copies again. This action is
              irreversible.
            </Text>
          )}
          <TransactionButton
            transactionCount={1}
            isLoading={burn.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
          >
            Burn
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
