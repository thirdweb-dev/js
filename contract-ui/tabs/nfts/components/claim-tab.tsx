import { Flex, FormControl, Input } from "@chakra-ui/react";
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
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });

  const claim = useClaimNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Claimed successfully",
    "Failed to claim",
  );

  return (
    <Flex
      pt={3}
      direction="column"
      as="form"
      onSubmit={form.handleSubmit(async (data) => {
        if (address) {
          trackEvent({
            category: "nft",
            action: "claim",
            label: "attempt",
          });

          try {
            await claim.mutateAsync({
              tokenId,
              quantity: data.amount,
              to: address,
            });
            trackEvent({
              category: "nft",
              action: "claim",
              label: "success",
            });
            onSuccess();
            form.reset();
          } catch (error) {
            trackEvent({
              category: "nft",
              action: "claim",
              label: "error",
              error,
            });
            onError(error);
          }
        }
      })}
    >
      <Flex gap={3} direction="column">
        <Flex gap={6} w="100%" direction="column">
          <FormControl
            isRequired
            isInvalid={!!form.getFieldState("to", form.formState).error}
          >
            <FormLabel>To Address</FormLabel>
            <Input
              placeholder={constants.AddressZero}
              {...form.register("to")}
            />
            <FormHelperText>Enter the address to claim to.</FormHelperText>
            <FormErrorMessage>
              {form.getFieldState("to", form.formState).error?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={!!form.getFieldState("amount", form.formState).error}
          >
            <FormLabel>Amount</FormLabel>
            <Input type="text" {...form.register("amount")} />
            <FormHelperText>How many would you like to claim?</FormHelperText>
            <FormErrorMessage>
              {form.getFieldState("amount", form.formState).error?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <TransactionButton
          transactionCount={1}
          isLoading={claim.isLoading || form.formState.isSubmitting}
          type="submit"
          colorScheme="primary"
          alignSelf="flex-end"
        >
          Claim
        </TransactionButton>
      </Flex>
    </Flex>
  );
};
