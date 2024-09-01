import { thirdwebClient } from "@/constants/client";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { useClaimNFT, useContract } from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZERO_ADDRESS, getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface ClaimTabProps {
  contractAddress: string;
  chainId: number;
  tokenId: string;
}

const ClaimTabERC1155: React.FC<ClaimTabProps> = ({
  contractAddress,
  chainId,
  tokenId,
}) => {
  const contractV4Query = useContract(contractAddress);
  const claimNftV4 = useClaimNFT(contractV4Query.contract);
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });
  const chain = useV5DashboardChain(chainId);

  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Claimed successfully",
    "Failed to claim",
    contract,
  );
  const account = useActiveAccount();
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
        if (!account) {
          return toast.error("No account detected");
        }
        try {
          await claimNftV4.mutateAsync({
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
            <Input
              type="text"
              {...form.register("amount", {
                validate: (value) => {
                  // must be an integer
                  const valueNum = Number(value);
                  if (!Number.isInteger(valueNum)) {
                    return "Amount must be an integer";
                  }
                },
              })}
            />
            <FormHelperText>How many would you like to claim?</FormHelperText>
            <FormErrorMessage>
              {form.getFieldState("amount", form.formState).error?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>

        <TransactionButton
          transactionCount={1}
          isLoading={form.formState.isSubmitting}
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

export default ClaimTabERC1155;
