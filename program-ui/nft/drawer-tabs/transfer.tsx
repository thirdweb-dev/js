import { FormControl, Input, Stack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { useTransferNFT } from "@thirdweb-dev/react/solana";
import type { NFTCollection, NFTDrop } from "@thirdweb-dev/sdk/solana";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface TransferTabProps {
  program: NFTCollection | NFTDrop;
  tokenId: string;
}

export const TransferTab: React.FC<TransferTabProps> = ({
  program,
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

  const transfer = useTransferNFT(program);

  const { onSuccess, onError } = useTxNotifications(
    "Transfer successful",
    "Error transferring",
  );
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
              receiverAddress: data.to,
              tokenAddress: tokenId,
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
              <Input
                placeholder={PublicKey.default.toBase58()}
                {...register("to")}
              />
              <FormHelperText>Enter the address to transfer to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
          </Stack>
          <TransactionButton
            ecosystem="solana"
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
