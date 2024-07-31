import { Flex, FormControl, Input } from "@chakra-ui/react";
import { type DropContract, useClaimNFT } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { ZERO_ADDRESS } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface ClaimTabProps {
  contract: DropContract;
  tokenId: string;
}

const ClaimTab: React.FC<ClaimTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });

  const claim = useClaimNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Claimed successfully",
    "Failed to claim",
    contract,
  );

  return (
    <Flex
      w="full"
      direction="column"
      as="form"
      onSubmit={form.handleSubmit(async (data) => {
        trackEvent({
          category: "nft",
          action: "claim",
          label: "attempt",
        });

        try {
          await claim.mutateAsync({
            tokenId,
            quantity: data.amount,
            to: data.to,
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
      })}
    >
      <Flex gap={3} direction="column">
        <Flex gap={6} w="100%" direction="column">
          <FormControl
            isRequired
            isInvalid={!!form.getFieldState("to", form.formState).error}
          >
            <FormLabel>To Address</FormLabel>
            <Input placeholder={ZERO_ADDRESS} {...form.register("to")} />
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

export default ClaimTab;
