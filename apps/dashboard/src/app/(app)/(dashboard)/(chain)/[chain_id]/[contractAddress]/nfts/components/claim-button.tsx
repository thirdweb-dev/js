"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "chakra/form";
import { GemIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTxNotifications } from "@/hooks/useTxNotifications";

const CLAIM_FORM_ID = "nft-claim-form";

interface NFTClaimButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

/**
 * This button is used for claiming NFT Drop contract (erc721) only!
 * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
 */
export const NFTClaimButton: React.FC<NFTClaimButtonProps> = ({
  contract,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;
  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: { amount: "1", to: address },
  });
  const { errors } = formState;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();
  const [open, setOpen] = useState(false);
  const claimNFTNotifications = useTxNotifications(
    "NFT claimed successfully",
    "Failed to claim NFT",
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="gap-2" variant="primary">
          <GemIcon className="size-4" /> Claim
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:w-[540px] sm:max-w-[90%] lg:w-[700px]">
        <SheetHeader>
          <SheetTitle className="text-left">Claim NFTs</SheetTitle>
        </SheetHeader>
        <form className="mt-8 flex w-full flex-col gap-3 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isInvalid={!!errors.to} isRequired>
              <FormLabel>To Address</FormLabel>
              <Input
                placeholder={ZERO_ADDRESS}
                {...register("to", {
                  onChange: (e) => {
                    setValue("to", e.target.value.trim(), {
                      shouldValidate: true,
                    });
                  },
                  validate: (value) => {
                    if (!value) {
                      return "Enter a recipient address";
                    }
                    if (!isAddress(value.trim())) {
                      return "Invalid EVM address";
                    }
                  },
                })}
              />
              <FormHelperText>Enter the address to claim to.</FormHelperText>
              <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.amount} isRequired>
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
            client={contract.client}
            form={CLAIM_FORM_ID}
            isLoggedIn={isLoggedIn}
            isPending={formState.isSubmitting}
            onClick={handleSubmit(async (d) => {
              try {
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
                  from: account.address,
                  quantity: BigInt(d.amount),
                  to: d.to.trim(),
                });

                const approveTx = await getApprovalForTransaction({
                  account,
                  transaction,
                });

                if (approveTx) {
                  const promise = sendAndConfirmTx.mutateAsync(approveTx, {
                    onError: (error) => {
                      console.error(error);
                    },
                  });
                  toast.promise(promise, {
                    error: "Failed to approve token",
                    loading: "Approving ERC20 tokens for this claim",
                    success: "Tokens approved successfully",
                  });

                  await promise;
                }

                await sendAndConfirmTx.mutateAsync(transaction, {
                  onError: (error) => {
                    console.error(error);
                  },
                  onSuccess: () => {
                    setOpen(false);
                  },
                });

                claimNFTNotifications.onSuccess();
              } catch (error) {
                console.error(error);
                claimNFTNotifications.onError(error);
              }
            })}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Claim NFT
          </TransactionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};
