import { FormControl, Input, Stack } from "@chakra-ui/react";
import { useMintNFTSupply } from "@thirdweb-dev/react/solana";
import { NFTCollection } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface MintSupplyTabProps {
  program: NFTCollection;
  tokenId: string;
}

export const MintSupplyTab: React.FC<MintSupplyTabProps> = ({
  program,
  tokenId,
}) => {
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });

  const mintSupply = useMintNFTSupply(program);

  const { onSuccess, onError } = useTxNotifications(
    "Mint successful",
    "Error minting additional supply",
  );

  return (
    <Stack pt={3}>
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "mint-supply",
            label: "attempt",
          });
          mintSupply.mutate(
            {
              nftAddress: tokenId,
              amount: data.amount,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "mint-supply",
                  label: "success",
                });
                onSuccess();
                reset();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "mint-supply",
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
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>Amount</FormLabel>
              <Input placeholder={"1"} {...register("amount")} />
              <FormHelperText>How many would you like to mint?</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <TransactionButton
            ecosystem="solana"
            transactionCount={1}
            isLoading={mintSupply.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
          >
            Mint
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
