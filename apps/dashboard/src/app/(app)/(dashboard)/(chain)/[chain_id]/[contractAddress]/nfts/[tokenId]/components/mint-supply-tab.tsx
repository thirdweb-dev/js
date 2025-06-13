"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, isAddress } from "thirdweb";
import { mintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { z } from "zod";

interface MintSupplyTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

const mintAdditionalSupplyFormSchema = z.object({
  to: z.string().refine((value) => isAddress(value), {
    message: "Invalid Ethereum address",
  }),
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

const MintSupplyTab: React.FC<MintSupplyTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;

  const form = useForm<z.input<typeof mintAdditionalSupplyFormSchema>>({
    resolver: zodResolver(mintAdditionalSupplyFormSchema),
    defaultValues: {
      amount: 1,
      to: address || "",
    },
  });

  const sendAndConfirmTx = useSendAndConfirmTransaction();

  function onSubmit(values: z.input<typeof mintAdditionalSupplyFormSchema>) {
    const transaction = mintAdditionalSupplyTo({
      contract,
      to: values.to,
      tokenId: BigInt(tokenId),
      supply: BigInt(values.amount),
    });
    const promise = sendAndConfirmTx.mutateAsync(transaction, {
      onSuccess: () => {
        form.reset();
      },
      onError: (error) => {
        console.error(error);
      },
    });
    toast.promise(promise, {
      loading: "Minting NFT",
      success: "Minted successfully",
      error: "Failed to mint",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
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
          client={contract.client}
          txChainID={contract.chain.id}
          transactionCount={1}
          isPending={sendAndConfirmTx.isPending}
          type="submit"
          className="self-end"
          isLoggedIn={isLoggedIn}
        >
          Mint
        </TransactionButton>
      </form>
    </Form>
  );
};

export default MintSupplyTab;
