import { FormControl, Input, Stack } from "@chakra-ui/react";
import { NFTContract, useTransferNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { detectFeatures } from "components/contract-components/utils";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface TransferTabProps {
  contract: NFTContract;
  tokenId: string;
}

export const TransferTab: React.FC<TransferTabProps> = ({
  contract,
  tokenId,
}) => {
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { to: "", amount: "1" },
  });

  const transfer = useTransferNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Transfer successful",
    "Error transferring",
  );

  const isErc1155 = detectFeatures(contract, ["ERC1155"]);

  return (
    <Stack pt={3}>
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "transfer",
            label: "attempt",
          });
          transfer.mutate(
            {
              tokenId,
              to: data.to,
              amount: data.amount,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "transfer",
                  label: "success",
                });
                onSuccess();
                reset();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "transfer",
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
              <FormLabel>To Address</FormLabel>
              <Input placeholder={constants.AddressZero} {...register("to")} />
              <FormHelperText>Enter the address to transfer to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            {isErc1155 && (
              <FormControl isRequired={isErc1155} isInvalid={!!errors.to}>
                <FormLabel>Amount</FormLabel>
                <Input placeholder={"1"} {...register("amount")} />
                <FormHelperText>
                  How many would you like to transfer?
                </FormHelperText>
                <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
          <TransactionButton
            transactionCount={1}
            isLoading={transfer.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
            isDisabled={!isDirty}
          >
            Transfer
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
