"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GemIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";
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

const claimFormSchema = z.object({
  amount: z.string().refine((val) => {
    const num = Number(val);
    return Number.isInteger(num) && num > 0;
  }, "Amount must be a positive integer"),
  to: z.string().refine((val) => {
    if (isAddress(val)) {
      return true;
    }
    return false;
  }, "Invalid address"),
});

type ClaimFormData = z.infer<typeof claimFormSchema>;

interface NFTClaimButtonProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

/**
 * This button is used for claiming NFT Drop contract (erc721) only!
 * For Edition Drop we have a dedicated ClaimTabERC1155 inside each Edition's page
 */
export function NFTClaimButton({ contract, isLoggedIn }: NFTClaimButtonProps) {
  const address = useActiveAccount()?.address;
  const form = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: { amount: "1", to: address },
  });
  const sendAndConfirmTx = useSendAndConfirmTx();
  const account = useActiveAccount();
  const [open, setOpen] = useState(false);

  async function onSubmit(data: ClaimFormData) {
    try {
      if (!account) {
        return toast.error("No account detected");
      }

      const transaction = claimTo({
        contract,
        from: account.address,
        quantity: BigInt(data.amount),
        to: data.to.trim(),
      });

      const approveTx = await getApprovalForTransaction({
        account,
        transaction,
      });

      if (approveTx) {
        const approveTxPromise = sendAndConfirmTx.mutateAsync(approveTx, {
          onError: (error) => {
            console.error(error);
          },
        });
        toast.promise(approveTxPromise, {
          error: (err) => ({
            message: "Failed to approve token",
            description: parseError(err),
          }),
          loading: "Approving ERC20 tokens for this claim",
          success: "Tokens approved successfully",
        });

        await approveTxPromise;
      }

      await sendAndConfirmTx.mutateAsync(transaction);

      toast.success("NFT claimed successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to claim NFT", {
        description: parseError(error),
      });
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="gap-2" variant="primary">
          <GemIcon className="size-4" /> Claim
        </Button>
      </SheetTrigger>

      <SheetContent className="!w-full !max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left">Claim NFTs</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-5"
          >
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>To Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      className="bg-card"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.trim());
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the address to claim to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-card"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value.trim());
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    How many would you like to claim?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <TransactionButton
                client={contract.client}
                isLoggedIn={isLoggedIn}
                isPending={form.formState.isSubmitting}
                onClick={() => {}}
                transactionCount={1}
                txChainID={contract.chain.id}
                type="submit"
              >
                Claim NFT
              </TransactionButton>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
