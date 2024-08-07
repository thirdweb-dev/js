import { thirdwebClient } from "@/constants/client";
import { FormControl, Input, Stack } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { getContract } from "thirdweb";
import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface MintSupplyTabProps {
  contractAddress: string;
  chainId: number;
  tokenId: string;
}

const MintSupplyTab: React.FC<MintSupplyTabProps> = ({
  contractAddress,
  chainId,
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
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
  const address = useActiveAccount()?.address;
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const { onSuccess, onError } = useTxNotifications(
    "Mint successful",
    "Error minting additional supply",
    contract,
  );

  return (
    <Stack w="full">
      <form
        onSubmit={handleSubmit((data) => {
          if (address) {
            trackEvent({
              category: "nft",
              action: "mint-supply",
              label: "attempt",
            });
            const transaction = mintAdditionalSupplyTo({
              contract,
              to: address,
              tokenId: BigInt(tokenId),
              supply: BigInt(data.amount),
            });
            mutate(transaction, {
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
            });
          }
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
            transactionCount={1}
            isLoading={isPending}
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

export default MintSupplyTab;
