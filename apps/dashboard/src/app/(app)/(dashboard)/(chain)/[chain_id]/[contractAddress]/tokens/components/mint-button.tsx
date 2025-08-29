"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";
import { MinterOnly } from "@/components/contracts/roles/minter-only";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { parseError } from "@/utils/errorParser";

const mintFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    }, "Amount must be a positive number"),
});

type MintFormValues = z.infer<typeof mintFormSchema>;

export function TokenMintButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTx();
  const form = useForm<MintFormValues>({
    resolver: zodResolver(mintFormSchema),
    defaultValues: { amount: "" },
    mode: "onChange",
  });

  async function handleSubmit(values: MintFormValues) {
    if (!address) {
      toast.error("No wallet connected");
      return;
    }

    const mintTx = ERC20Ext.mintTo({
      amount: values.amount,
      contract: props.contract,
      to: address,
    });

    const mintTxPromise = sendAndConfirmTx.mutateAsync(mintTx);
    toast.promise(mintTxPromise, {
      error: (err) => ({
        message: "Failed to mint tokens",
        description: parseError(err),
      }),
      success: "Tokens minted successfully",
    });

    await mintTxPromise;
  }

  return (
    <MinterOnly contract={props.contract}>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="gap-2">
            <PlusIcon className="size-4" /> Mint
          </Button>
        </SheetTrigger>

        <SheetContent className="!w-full lg:!max-w-lg">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left">
              Mint additional tokens
            </SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Supply</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} className="bg-card" />
                    </FormControl>
                    <FormDescription>
                      The amount of tokens to mint
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6 flex">
                <TransactionButton
                  client={props.contract.client}
                  disabled={!form.formState.isDirty || !form.formState.isValid}
                  isLoggedIn={props.isLoggedIn}
                  isPending={sendAndConfirmTx.isPending}
                  transactionCount={1}
                  txChainID={props.contract.chain.id}
                  type="submit"
                >
                  Mint Tokens
                </TransactionButton>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
}
