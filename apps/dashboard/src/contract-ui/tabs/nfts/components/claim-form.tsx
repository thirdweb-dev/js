"use client";

import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  FormControl,
  Input,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

const CLAIM_FORM_ID = "nft-claim-form";
interface NFTClaimFormProps {
  contract: ThirdwebContract;
}

export const NFTClaimForm: React.FC<NFTClaimFormProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { amount: "1", to: address },
  });
  const { errors } = formState;
  const modalContext = useModalContext();

  const txNotifications = useTxNotifications(
    "Successfully claimed NFTs",
    "Failed to claim NFT",
    contract,
  );
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();

  return (
    <>
      <DrawerHeader>
        <Heading>Claim NFTs</Heading>
      </DrawerHeader>
      <DrawerBody>
        <form className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>To Address</FormLabel>
              <Input placeholder={ZERO_ADDRESS} {...register("to")} />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                {...register("amount", {
                  validate: (value) => {
                    const valueNum = Number(value);
                    if (!Number.isInteger(valueNum)) {
                      return "Amount must be an integer";
                    }
                  },
                })}
              />
              <FormHelperText>How many would you like to claim?</FormHelperText>
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
          </div>
        </form>
      </DrawerBody>
      <DrawerFooter>
        <TransactionButton
          txChainID={contract.chain.id}
          transactionCount={1}
          form={CLAIM_FORM_ID}
          isLoading={formState.isSubmitting}
          type="submit"
          colorScheme="primary"
          onClick={handleSubmit(async (d) => {
            trackEvent({
              category: "nft",
              action: "claim",
              label: "attempt",
            });
            if (!account) {
              return toast.error("No account detected");
            }
            if (!d.to) {
              return txNotifications.onError(
                new Error("Please enter the address that will receive the NFT"),
              );
            }

            try {
              const transaction = claimTo({
                contract,
                to: d.to,
                quantity: BigInt(d.amount),
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
              txNotifications.onSuccess();
              modalContext.onClose();
            } catch (error) {
              trackEvent({
                category: "nft",
                action: "claim",
                label: "error",
                error,
              });

              txNotifications.onError(error);
            }
          })}
        >
          Claim NFT
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
