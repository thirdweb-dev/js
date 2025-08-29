"use client";

import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { burn as burn721, isERC721 } from "thirdweb/extensions/erc721";
import { burn as burn1155, isERC1155 } from "thirdweb/extensions/erc1155";
import {
  useActiveAccount,
  useInvalidateContractQuery,
  useReadContract,
} from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { useTxNotifications } from "@/hooks/useTxNotifications";

type BurnTabProps = {
  tokenId: string;
  contract: ThirdwebContract;
  isLoggedIn: boolean;
};

function BurnTab({ contract, tokenId, isLoggedIn }: BurnTabProps) {
  const account = useActiveAccount();

  const form = useForm<{ to: string; amount: string }>({
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
  const { mutate, isPending } = useSendAndConfirmTx();

  const onSubmit = (data: { to: string; amount: string }) => {
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
        form.reset();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {isErc1155 && (
            <div className="flex w-full flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many would you like to burn?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {isErc721 && (
            <p className="text-sm text-muted-foreground">
              Burning this NFT will remove it from your wallet. The NFT data
              will continue to be accessible but no one will be able to claim
              ownership over it again. This action is irreversible.
            </p>
          )}
          {isErc1155 && (
            <p className="text-sm text-muted-foreground">
              Burning these{" "}
              {`${Number.parseInt(form.watch("amount")) > 1 ? form.watch("amount") : ""} `}
              copies of the NFT will remove them them from your wallet. The NFT
              data will continue to be accessible but no one will be able to
              claim ownership over these copies again. This action is
              irreversible.
            </p>
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
        </form>
      </Form>
    </div>
  );
}

export default BurnTab;
