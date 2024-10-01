"use client";

import { Flex, FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface ClaimTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

const ClaimTabERC1155: React.FC<ClaimTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });

  const { onSuccess, onError } = useTxNotifications(
    "Claimed successfully",
    "Failed to claim",
    contract,
  );

  const sendAndConfirmTx = useSendAndConfirmTransaction();
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
          const transaction = claimTo({
            contract,
            tokenId: BigInt(tokenId),
            quantity: BigInt(data.amount),
            to: data.to,
            from: account.address,
          });
          const approveTx = await getApprovalForTransaction({
            transaction,
            account,
          });
          if (approveTx) {
            try {
              await sendAndConfirmTx.mutateAsync(approveTx);
            } catch {
              return toast.error("Error approving ERC20 token");
            }
          }
          await sendAndConfirmTx.mutateAsync(transaction);
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
          txChainID={contract.chain.id}
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
