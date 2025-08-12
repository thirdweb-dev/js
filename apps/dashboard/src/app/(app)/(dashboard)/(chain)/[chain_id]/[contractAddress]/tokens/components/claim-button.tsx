"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GemIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { z } from "zod";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
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
import { parseError } from "@/utils/errorParser";

const claimFormSchema = z.object({
  to: z.string().refine(
    (val) => {
      if (isAddress(val)) return true;
      return false;
    },
    { message: "Invalid address" },
  ),
  amount: z.string().refine(
    (val) => {
      // must be a positive number
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" },
  ),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;

export function TokenClaimButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const sendAndConfirmTransaction = useSendAndConfirmTransaction();
  const account = useActiveAccount();

  const form = useForm<ClaimFormValues>({
    defaultValues: { amount: "0", to: account?.address || "" },
    resolver: zodResolver(claimFormSchema),
  });

  async function onSubmit(d: ClaimFormValues) {
    if (!account) {
      return toast.error("Wallet is not connected");
    }

    const transaction = ERC20Ext.claimTo({
      contract: props.contract,
      from: account.address,
      quantity: d.amount,
      to: d.to,
    });

    const approveTx = await ERC20Ext.getApprovalForTransaction({
      account,
      transaction,
    });

    if (approveTx) {
      const approveTxPromise = sendAndConfirmTransaction.mutateAsync(approveTx);
      toast.promise(approveTxPromise, {
        error: (error) => ({
          loading: "Approve Spending for claiming tokens",
          message: "Failed to approve tokens",
          description: parseError(error),
        }),
        success: "Tokens approved successfully",
      });

      await approveTxPromise;
    }

    const claimTxPromise = sendAndConfirmTransaction.mutateAsync(transaction);

    toast.promise(claimTxPromise, {
      error: (error) => ({
        loading: "Claiming tokens",
        message: "Failed to claim tokens",
        description: parseError(error),
      }),
      success: "Tokens claimed successfully",
    });

    await claimTxPromise;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <GemIcon className="size-4" /> Claim
        </Button>
      </SheetTrigger>
      <SheetContent className="!w-full lg:!max-w-xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left">Claim tokens</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0x..."
                        {...field}
                        className="bg-card"
                      />
                    </FormControl>
                    <FormDescription>
                      The wallet address of the recipient
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <DecimalInput {...field} className="bg-card" />
                    </FormControl>
                    <FormDescription>
                      The amount of tokens to claim
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex">
              <TransactionButton
                client={props.contract.client}
                isLoggedIn={props.isLoggedIn}
                isPending={form.formState.isSubmitting}
                transactionCount={1}
                txChainID={props.contract.chain.id}
                type="submit"
              >
                Claim Tokens
              </TransactionButton>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
