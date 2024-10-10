"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface MintSupplyTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

// Intended for Edition contracts (not Edition Drop)
const MintSupplyTab: React.FC<MintSupplyTabProps> = ({ contract, tokenId }) => {
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });

  const address = useActiveAccount()?.address;
  const { mutateAsync, isPending } = useSendAndConfirmTransaction();

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={handleSubmit((data) => {
        if (!address) {
          return toast.error("No wallet connected.");
        }
        trackEvent({
          category: "nft",
          action: "mint-supply",
          label: "attempt",
        });
        const transaction = mintAdditionalSupplyTo({
          contract,
          to: address,
          tokenId: BigInt(tokenId),
          supply: BigInt(data.amount),
        });
        const promise = mutateAsync(transaction, {
          onSuccess: () => {
            trackEvent({
              category: "nft",
              action: "mint-supply",
              label: "success",
            });
            reset();
          },
          onError: (error) => {
            trackEvent({
              category: "nft",
              action: "mint-supply",
              label: "error",
              error,
            });
            console.error(error);
          },
        });
        toast.promise(promise, {
          loading: "Minting additional supply",
          success: "NFT(s) minted successfully",
          error: "Failed to mint NFT(s)",
        });
      })}
    >
      <div className="flex flex-col gap-3">
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <FormControl isRequired isInvalid={!!errors.to}>
            <FormLabel>Amount</FormLabel>
            <Input placeholder="1" {...register("amount")} min={1} />
            <FormHelperText>How many would you like to mint?</FormHelperText>
            <FormLabel className="mt-3">Recipient</FormLabel>
            <Input
              placeholder="0x..."
              defaultValue={address || ""}
              {...register("to")}
            />
            <FormHelperText>
              Address to receive the NFT(s) - Defaults to your own wallet
            </FormHelperText>
            <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
          </FormControl>
        </div>

        <TransactionButton
          txChainID={contract.chain.id}
          transactionCount={1}
          isLoading={isPending}
          type="submit"
          colorScheme="primary"
          alignSelf="flex-end"
        >
          Mint
        </TransactionButton>
      </div>
    </form>
  );
};

export default MintSupplyTab;
