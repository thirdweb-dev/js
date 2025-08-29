"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ForwardIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import { z } from "zod";
import { SolidityInput } from "@/components/solidity-inputs";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { parseError } from "@/utils/errorParser";

const transferFormSchema = z.object({
  to: z.string().refine(
    (val) => {
      if (isAddress(val)) {
        return true;
      }
      return false;
    },
    {
      message: "Invalid address",
    },
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

type TransferFormValues = z.infer<typeof transferFormSchema>;

export function TokenTransferButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const form = useForm<TransferFormValues>({
    defaultValues: { amount: "0", to: "" },
    resolver: zodResolver(transferFormSchema),
  });
  const sendAndConfirmTx = useSendAndConfirmTx();

  async function onSubmit(values: TransferFormValues) {
    const transferTx = ERC20Ext.transfer({
      amount: values.amount,
      contract: props.contract,
      to: values.to,
    });

    const transferTxPromise = sendAndConfirmTx.mutateAsync(transferTx);

    toast.promise(transferTxPromise, {
      error: (error) => ({
        message: "Failed to transfer tokens",
        description: parseError(error),
      }),
      success: "Successfully transferred tokens",
    });

    await transferTxPromise;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <ForwardIcon className="size-4" /> Transfer
        </Button>
      </SheetTrigger>
      <SheetContent className="!w-full lg:!max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left tracking-tight">
            Transfer tokens
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <SolidityInput
                        client={props.contract.client}
                        formContext={form}
                        placeholder={ZERO_ADDRESS}
                        solidityType="address"
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
                      <DecimalInput
                        id="amount"
                        value={field.value}
                        className="bg-card"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of tokens to transfer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex mt-6">
              <TransactionButton
                client={props.contract.client}
                isLoggedIn={props.isLoggedIn}
                isPending={sendAndConfirmTx.isPending}
                type="submit"
                transactionCount={1}
                txChainID={props.contract.chain.id}
              >
                Transfer Tokens
              </TransactionButton>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
