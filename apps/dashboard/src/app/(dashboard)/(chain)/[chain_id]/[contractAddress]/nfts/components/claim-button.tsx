"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { GemIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button } from "tw-components";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

const CLAIM_FORM_ID = "nft-claim-form";

interface NFTClaimButtonProps {
  contract: ThirdwebContract;
}

/**
 * This button is used for claiming NFT Drop contract (erc721) only!
 * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
 */
export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({ contract }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const { register, handleSubmit, formState } = useForm({
    defaultValues: { amount: "1", to: address },
  });
  const { errors } = formState;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button colorScheme="primary" leftIcon={<GemIcon className="size-4" />}>
          Claim
        </Button>
      </SheetTrigger>
      <SheetContent className="z-[10000] overflow-y-auto sm:w-[540px] sm:max-w-[90%] lg:w-[700px]">
        <SheetHeader>
          <SheetTitle>Claim NFTs</SheetTitle>
        </SheetHeader>
        <form className="mt-8 flex w-full flex-col gap-3 md:flex-row">
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
        <div className="mt-4 flex justify-end">
          <TransactionButton
            txChainID={contract.chain.id}
            transactionCount={1}
            form={CLAIM_FORM_ID}
            isLoading={formState.isSubmitting}
            type="submit"
            colorScheme="primary"
            onClick={handleSubmit(async (d) => {
              try {
                trackEvent({
                  category: "nft",
                  action: "claim",
                  label: "attempt",
                });
                if (!account) {
                  return toast.error("No account detected");
                }
                if (!d.to) {
                  return toast.error(
                    "Please enter the address that will receive the NFT",
                  );
                }

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
                  const promise = sendAndConfirmTx.mutateAsync(approveTx, {
                    onError: (error) => {
                      console.error(error);
                    },
                  });
                  toast.promise(promise, {
                    loading: "Approving ERC20 tokens for this claim",
                    success: "Tokens approved successfully",
                    error: "Failed to approve token",
                  });

                  await promise;
                }

                const promise = sendAndConfirmTx.mutateAsync(transaction, {
                  onSuccess: () => {
                    trackEvent({
                      category: "nft",
                      action: "claim",
                      label: "success",
                    });
                    setOpen(false);
                  },
                  onError: (error) => {
                    trackEvent({
                      category: "nft",
                      action: "claim",
                      label: "error",
                      error,
                    });
                  },
                });

                toast.promise(promise, {
                  loading: "Claiming NFT(s)",
                  success: "NFT(s) claimed successfully",
                  error: "Failed to claim NFT(s)",
                });
              } catch (error) {
                console.error(error);
                toast.error((error as Error).message || "Error claiming NFT");
                trackEvent({
                  category: "nft",
                  action: "claim",
                  label: "error",
                  error,
                });
              }
            })}
          >
            Claim NFT
          </TransactionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};
