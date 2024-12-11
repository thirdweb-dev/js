"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { burn as burn721, isERC721 } from "thirdweb/extensions/erc721";
import { burn as burn1155, isERC1155 } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useInvalidateContractQuery,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface BurnTabProps {
  tokenId: string;
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

const BurnTab: React.FC<BurnTabProps> = ({ contract, tokenId, twAccount }) => {
  const account = useActiveAccount();
  const trackEvent = useTrack();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<{ to: string; amount: string }>({
    defaultValues: { amount: "1" },
  });
  const invalidateContractQuery = useInvalidateContractQuery();

  const { onSuccess, onError } = useTxNotifications(
    "Burn successful",
    "Error burning",
  );
  const { data: isErc721, isPending: checking721 } = useReadContract(isERC721, {
    contract,
  });
  const { data: isErc1155, isPending: checking1155 } = useReadContract(
    isERC1155,
    { contract },
  );
  const { mutate, isPending } = useSendAndConfirmTransaction();

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "burn",
            label: "attempt",
          });
          const transaction = isErc721
            ? burn721({ contract, tokenId: BigInt(tokenId) })
            : burn1155({
                contract,
                id: BigInt(tokenId),
                value: BigInt(data.amount),
                account: account?.address ?? "",
              });
          mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "nft",
                action: "burn",
                label: "success",
              });
              onSuccess();
              if (contract) {
                invalidateContractQuery({
                  chainId: contract.chain.id,
                  contractAddress: contract.address,
                });
              }
              reset();
            },
            onError: (error) => {
              trackEvent({
                category: "nft",
                action: "burn",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
      >
        <div className="flex flex-col gap-3">
          {isErc1155 && (
            <div className="flex w-full flex-col gap-6 md:flex-row">
              <FormControl isRequired={isErc1155} isInvalid={!!errors.amount}>
                <FormLabel>Amount</FormLabel>
                <Input placeholder="1" {...register("amount")} />
                <FormHelperText>
                  How many would you like to burn?
                </FormHelperText>
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
              </FormControl>
            </div>
          )}
          {isErc721 && (
            <Text>
              Burning this NFT will remove it from your wallet. The NFT data
              will continue to be accessible but no one will be able to claim
              ownership over it again. This action is irreversible.
            </Text>
          )}
          {isErc1155 && (
            <Text>
              Burning these{" "}
              {`${Number.parseInt(watch("amount")) > 1 ? watch("amount") : ""} `}
              copies of the NFT will remove them them from your wallet. The NFT
              data will continue to be accessible but no one will be able to
              claim ownership over these copies again. This action is
              irreversible.
            </Text>
          )}
          <TransactionButton
            transactionCount={1}
            isPending={isPending}
            disabled={checking1155 || checking721 || isPending || !account}
            type="submit"
            className="self-end"
            txChainID={contract.chain.id}
            twAccount={twAccount}
          >
            Burn
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};

export default BurnTab;
