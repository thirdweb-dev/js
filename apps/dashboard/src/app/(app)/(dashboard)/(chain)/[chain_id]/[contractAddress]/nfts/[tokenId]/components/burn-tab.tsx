"use client";

import { FormControl, Input } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
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
  isLoggedIn: boolean;
}

const BurnTab: React.FC<BurnTabProps> = ({ contract, tokenId, isLoggedIn }) => {
  const account = useActiveAccount();

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
          const transaction = isErc721
            ? burn721({ contract, tokenId: BigInt(tokenId) })
            : burn1155({
                account: account?.address ?? "",
                contract,
                id: BigInt(tokenId),
                value: BigInt(data.amount),
              });
          mutate(transaction, {
            onError: (error) => {
              onError(error);
            },
            onSuccess: () => {
              onSuccess();
              if (contract) {
                invalidateContractQuery({
                  chainId: contract.chain.id,
                  contractAddress: contract.address,
                });
              }
              reset();
            },
          });
        })}
      >
        <div className="flex flex-col gap-3">
          {isErc1155 && (
            <div className="flex w-full flex-col gap-6 md:flex-row">
              <FormControl isInvalid={!!errors.amount} isRequired={isErc1155}>
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
            className="self-end"
            client={contract.client}
            disabled={checking1155 || checking721 || isPending || !account}
            isLoggedIn={isLoggedIn}
            isPending={isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Burn
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};

export default BurnTab;
