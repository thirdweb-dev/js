"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FlameIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, toUnits } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSendAndConfirmTx } from "@/hooks/useSendTx";
import { parseError } from "@/utils/errorParser";

const burnSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !Number.isNaN(num) && num > 0;
    },
    {
      message: "Amount must be greater than 0",
    },
  ),
});

export function TokenBurnButton(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const sendAndConfirmTx = useSendAndConfirmTx();
  const form = useForm<z.infer<typeof burnSchema>>({
    defaultValues: { amount: "0" },
    resolver: zodResolver(burnSchema),
  });

  async function onSubmit(data: z.infer<typeof burnSchema>) {
    // TODO: burn should be updated to take amount / amountWei (v6?)
    const burnTokensTx = ERC20Ext.burn({
      asyncParams: async () => {
        return {
          amount: toUnits(
            data.amount,
            await ERC20Ext.decimals({ contract: props.contract }),
          ),
        };
      },
      contract: props.contract,
    });

    const txPromise = sendAndConfirmTx.mutateAsync(burnTokensTx);

    toast.promise(txPromise, {
      error: (error) => ({
        message: "Failed to burn tokens",
        description: parseError(error),
      }),
      success: "Tokens burned successfully",
    });

    await txPromise;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <FlameIcon className="size-4" /> Burn
        </Button>
      </SheetTrigger>

      <SheetContent className="!w-full lg:!max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-left tracking-tight">
            Burn tokens
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-6 md:flex-row mb-3">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <DecimalInput className="bg-card" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many would you like to burn?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Burning these tokens will remove them from the total circulating
              supply. This action is irreversible.
            </p>

            <TransactionButton
              client={props.contract.client}
              disabled={!form.formState.isDirty}
              isLoggedIn={props.isLoggedIn}
              isPending={sendAndConfirmTx.isPending}
              transactionCount={1}
              txChainID={props.contract.chain.id}
              type="submit"
            >
              Burn Tokens
            </TransactionButton>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
