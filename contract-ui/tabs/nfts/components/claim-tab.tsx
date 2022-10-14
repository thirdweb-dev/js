import { FormControl, Input, Stack } from "@chakra-ui/react";
import { DropContract, useAddress, useClaimNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { constants } from "ethers";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface ClaimTabProps {
  contract: DropContract;
  tokenId: string;
}

export const ClaimTab: React.FC<ClaimTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const address = useAddress();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });

  const claim = useClaimNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Mint successful",
    "Error minting additional supply",
  );

  return (
    <Stack pt={3}>
      <form
        onSubmit={handleSubmit((data) => {
          if (address) {
            trackEvent({
              category: "nft",
              action: "claim",
              label: "attempt",
            });
            claim.mutate(
              {
                tokenId,
                quantity: data.amount,
                to: address,
              },
              {
                onSuccess: () => {
                  trackEvent({
                    category: "nft",
                    action: "claim",
                    label: "success",
                  });
                  onSuccess();
                  reset();
                },
                onError: (error) => {
                  trackEvent({
                    category: "nft",
                    action: "claim",
                    label: "error",
                    error,
                  });
                  onError(error);
                },
              },
            );
          }
        })}
      >
        <Stack gap={3}>
          <Stack spacing={6} w="100%" direction={{ base: "column", md: "row" }}>
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>To Address</FormLabel>
              <Input placeholder={constants.AddressZero} {...register("to")} />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input type="text" {...register("amount")} />
              <FormHelperText>How many would you like to claim?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <TransactionButton
            transactionCount={1}
            isLoading={claim.isLoading}
            type="submit"
            colorScheme="primary"
            alignSelf="flex-end"
          >
            Claim
          </TransactionButton>
        </Stack>
      </form>
    </Stack>
  );
};
