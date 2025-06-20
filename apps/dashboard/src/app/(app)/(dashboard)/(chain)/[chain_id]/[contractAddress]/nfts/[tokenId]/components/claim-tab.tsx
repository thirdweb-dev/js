"use client";

import { Flex, FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
import { parseError } from "utils/errorParser";

interface ClaimTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

const ClaimTabERC1155: React.FC<ClaimTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;
  const form = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1", to: address },
  });
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={form.handleSubmit(async (data) => {
        if (!account) {
          return toast.error("No account detected");
        }
        try {
          const transaction = claimTo({
            contract,
            from: account.address,
            quantity: BigInt(data.amount),
            to: data.to,
            tokenId: BigInt(tokenId),
          });
          const approveTx = await getApprovalForTransaction({
            account,
            transaction,
          });
          if (approveTx) {
            const approvalPromise = sendAndConfirmTx.mutateAsync(approveTx);
            toast.promise(approvalPromise, {
              error: "Failed to approve ERC20",
              success: "Approved successfully",
            });
            await approvalPromise;
          }
          const promise = sendAndConfirmTx.mutateAsync(transaction);
          toast.promise(promise, {
            error: (error) => {
              return {
                description: parseError(error),
                message: "Failed to claim NFT",
              };
            },
            loading: "Claiming NFT",
            success: "NFT claimed successfully",
          });

          form.reset();
        } catch (error) {
          console.error(error);
        }
      })}
      w="full"
    >
      <Flex direction="column" gap={3}>
        <Flex direction="column" gap={6} w="100%">
          <FormControl
            isInvalid={!!form.getFieldState("to", form.formState).error}
            isRequired
          >
            <FormLabel>To Address</FormLabel>
            <Input placeholder={ZERO_ADDRESS} {...form.register("to")} />
            <FormHelperText>Enter the address to claim to.</FormHelperText>
            <FormErrorMessage>
              {form.getFieldState("to", form.formState).error?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={!!form.getFieldState("amount", form.formState).error}
            isRequired
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
          className="self-end"
          client={contract.client}
          isLoggedIn={isLoggedIn}
          isPending={form.formState.isSubmitting}
          transactionCount={1}
          txChainID={contract.chain.id}
          type="submit"
        >
          Claim
        </TransactionButton>
      </Flex>
    </Flex>
  );
};

export default ClaimTabERC1155;
