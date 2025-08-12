"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress, type ThirdwebContract } from "thirdweb";
import { getApprovalForTransaction } from "thirdweb/extensions/erc20";
import { claimTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { z } from "zod";
import { TransactionButton } from "@/components/tx-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { parseError } from "@/utils/errorParser";

const claimFormSchema = z.object({
  to: z
    .string()
    .min(1, "To address is required")
    .refine((val) => {
      if (isAddress(val)) {
        return true;
      }
      return false;
    }, "Invalid address"),
  amount: z.string().refine((value) => {
    const valueNum = Number(value);
    return Number.isInteger(valueNum) && valueNum > 0;
  }, "Amount must be a positive integer"),
});

type ClaimFormData = z.infer<typeof claimFormSchema>;

interface ClaimTabProps {
  contract: ThirdwebContract;
  tokenId: string;
  isLoggedIn: boolean;
}

const ClaimTabERC1155: React.FC<ClaimTabProps> = ({
  contract,
  tokenId,
  isLoggedIn,
}) => {
  const address = useActiveAccount()?.address;
  const form = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: { amount: "1", to: address },
  });
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const account = useActiveAccount();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          if (!account) {
            return toast.error("No account detected");
          }
          try {
            const transaction = claimTo({
              contract,
              from: account.address,
              quantity: BigInt(data.amount),
              to: data.to,
              tokenId: BigInt(tokenId),
            });
            const approveTx = await getApprovalForTransaction({
              account,
              transaction,
            });
            if (approveTx) {
              const approvalPromise = sendAndConfirmTx.mutateAsync(approveTx);
              toast.promise(approvalPromise, {
                error: "Failed to approve ERC20",
                success: "Approved successfully",
              });
              await approvalPromise;
            }
            const promise = sendAndConfirmTx.mutateAsync(transaction);
            toast.promise(promise, {
              error: (error) => {
                return {
                  description: parseError(error),
                  message: "Failed to claim NFT",
                };
              },
              loading: "Claiming NFT",
              success: "NFT claimed successfully",
            });

            form.reset();
          } catch (error) {
            toast.error("Failed to claim NFT", {
              description: parseError(error),
            });
            console.error(error);
          }
        })}
        className="w-full"
      >
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Address</FormLabel>
                <FormControl>
                  <Input placeholder="0x..." {...field} className="bg-card" />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Enter the address to claim to.
                </p>
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
                  <Input type="text" {...field} className="bg-card" />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  How many would you like to claim?
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <TransactionButton
            className="self-end"
            client={contract.client}
            isLoggedIn={isLoggedIn}
            isPending={form.formState.isSubmitting}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            Claim
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
};

export default ClaimTabERC1155;
