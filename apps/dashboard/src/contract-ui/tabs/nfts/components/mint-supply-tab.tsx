"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";

interface MintSupplyTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

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
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const { onSuccess, onError } = useTxNotifications(
    "Mint successful",
    "Error minting additional supply",
    contract,
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit((data) => {
          if (address) {
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
            mutate(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "mint-supply",
                  label: "success",
                });
                onSuccess();
                reset();
              },
              onError: (error) => {
                trackEvent({
                  category: "nft",
                  action: "mint-supply",
                  label: "error",
                  error,
                });
                onError(error);
              },
            });
          }
        })}
      >
        <div className="flex flex-col gap-3">
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <FormControl isRequired isInvalid={!!errors.to}>
              <FormLabel>Amount</FormLabel>
              <Input placeholder="1" {...register("amount")} />
              <FormHelperText>How many would you like to mint?</FormHelperText>
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
    </div>
  );
};

export default MintSupplyTab;
