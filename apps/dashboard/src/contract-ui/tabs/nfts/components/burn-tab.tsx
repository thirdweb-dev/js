import { thirdwebClient } from "@/constants/client";
import { FormControl, Input, Stack } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { getContract } from "thirdweb";
import { burn as burn721, isERC721 } from "thirdweb/extensions/erc721";
import { burn as burn1155, isERC1155 } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useInvalidateContractQuery,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface BurnTabProps {
  tokenId: string;
  contractAddress: string;
  chainId: number;
}

const BurnTab: React.FC<BurnTabProps> = ({
  contractAddress,
  chainId,
  tokenId,
}) => {
  const account = useActiveAccount();
  const chain = useV5DashboardChain(chainId);
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });
  const invalidateContractQuery = useInvalidateContractQuery();
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );
  const { data: isErc721, isLoading: checking721 } = useReadContract(isERC721, {
    contract,
  });
  const { data: isErc1155, isLoading: checking1155 } = useReadContract(
    isERC1155,
    { contract },
  );
  const { mutate, isPending } = useSendAndConfirmTransaction();

  return (
    <Stack w="full">
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "burn",
            label: "attempt",
          });
          const transaction = isErc721
            ? burn721({ contract, tokenId: BigInt(tokenId) })
            : burn1155({
                contract,
                id: BigInt(tokenId),
                value: BigInt(data.amount),
                account: account?.address ?? "",
              });
          mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "nft",
                action: "burn",
                label: "success",
              });
              onSuccess();
              if (contract) {
                invalidateContractQuery({
                  chainId,
                  contractAddress,
                });
              }
              reset();
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
          });
        })}
      >
        <Stack gap={3}>
          {isErc1155 && (
            <Stack
              spacing={6}
              w="100%"
              direction={{ base: "column", md: "row" }}
            >
              <FormControl isRequired={isErc1155} isInvalid={!!errors.amount}>
                <FormLabel>Amount</FormLabel>
                <Input placeholder={"1"} {...register("amount")} />
                <FormHelperText>
                  How many would you like to burn?
                </FormHelperText>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
              </FormControl>
            </Stack>
          )}
          {isErc721 && (
            <Text>
              Burning this NFT will remove it from your wallet. The NFT data
              will continue to be accessible but no one will be able to claim
              ownership over it again. This action is irreversible.
            </Text>
          )}
          {isErc1155 && (
            <Text>
              Burning these{" "}
              {`${Number.parseInt(watch("amount")) > 1 ? watch("amount") : ""} `}
              copies of the NFT will remove them them from your wallet. The NFT
              data will continue to be accessible but no one will be able to
              claim ownership over these copies again. This action is
              irreversible.
            </Text>
          )}
          <TransactionButton
            transactionCount={1}
            isLoading={isPending}
            isDisabled={checking1155 || checking721 || isPending || !account}
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

export default BurnTab;
