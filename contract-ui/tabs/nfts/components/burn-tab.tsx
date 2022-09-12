import { FormControl, Input, Stack } from "@chakra-ui/react";
import { NFTContract, useBurnNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface BurnTabProps {
  contract: NFTContract;
  tokenId: string;
}

export const BurnTab: React.FC<BurnTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });

  const burn = useBurnNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );

  const isErc721 = detectFeatures(contract, ["ERC721"]);
  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

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
            },
          );
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
            isDisabled={!isDirty && isErc1155}
          >
            Burn
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
