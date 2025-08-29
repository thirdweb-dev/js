"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract } from "thirdweb";
import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";
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

interface MintSupplyTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

const mintAdditionalSupplyFormSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
  to: z.string().refine((value) => isAddress(value), {
    message: "Invalid Ethereum address",
  }),
});

const MintSupplyTab: React.FC<MintSupplyTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;

  const form = useForm<z.input<typeof mintAdditionalSupplyFormSchema>>({
    defaultValues: {
      amount: 1,
      to: address || "",
    },
    resolver: zodResolver(mintAdditionalSupplyFormSchema),
  });

  const sendAndConfirmTx = useSendAndConfirmTx();

  function onSubmit(values: z.input<typeof mintAdditionalSupplyFormSchema>) {
    const transaction = mintAdditionalSupplyTo({
      contract,
      supply: BigInt(values.amount),
      to: values.to,
      tokenId: BigInt(tokenId),
    });
    const promise = sendAndConfirmTx.mutateAsync(transaction, {
      onSuccess: () => {
        form.reset();
      },
    });
    toast.promise(promise, {
      error: "Failed to mint",
      loading: "Minting NFT",
      success: "Minted successfully",
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
                How many would you like to mint?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TransactionButton
          className="self-end"
          client={contract.client}
          isLoggedIn={isLoggedIn}
          isPending={sendAndConfirmTx.isPending}
          transactionCount={1}
          txChainID={contract.chain.id}
          type="submit"
        >
          Mint
        </TransactionButton>
      </form>
    </Form>
  );
};

export default MintSupplyTab;
