"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
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
  twAccount: Account | undefined;
}

const ClaimTabERC1155: React.FC<ClaimTabProps> = ({
  contract,
  tokenId,
  twAccount,
}) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });
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
            const approvalPromise = sendAndConfirmTx.mutateAsync(approveTx);
            toast.promise(approvalPromise, {
              success: "Approved successfully",
              error: "Failed to approve ERC20",
            });
            await approvalPromise;
          }
          const promise = sendAndConfirmTx.mutateAsync(transaction);
          toast.promise(promise, {
            loading: "Claiming NFT",
            success: "NFT claimed successfully",
            error: "Failed to claim NFT",
          });
          trackEvent({
            category: "nft",
            action: "claim",
            label: "success",
          });
          form.reset();
        } catch (error) {
          console.error(error);
          trackEvent({
            category: "nft",
            action: "claim",
            label: "error",
            error,
          });
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
          isPending={form.formState.isSubmitting}
          type="submit"
          className="self-end"
          twAccount={twAccount}
        >
          Claim
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default ClaimTabERC1155;
