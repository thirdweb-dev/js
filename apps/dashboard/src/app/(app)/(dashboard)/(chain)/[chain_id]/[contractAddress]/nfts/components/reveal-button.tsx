"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import { getBatchesToReveal, reveal } from "thirdweb/extensions/erc721";
import { useReadContract, useSendAndConfirmTransaction } from "thirdweb/react";
import * as z from "zod";
import { MinterOnly } from "@/components/contracts/roles/minter-only";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { parseError } from "@/utils/errorParser";

const revealFormSchema = z.object({
  batchId: z.string().min(1, "Please select a batch"),
  password: z.string().min(1, "Password is required"),
});

type RevealFormData = z.infer<typeof revealFormSchema>;

export function NFTRevealButton({
  contract,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const batchesQuery = useReadContract(getBatchesToReveal, {
    contract,
  });

  const sendTxMutation = useSendAndConfirmTransaction();

  const form = useForm<RevealFormData>({
    resolver: zodResolver(revealFormSchema),
    defaultValues: {
      batchId: "",
      password: "",
    },
  });

  const [open, setOpen] = useState(false);

  if (!batchesQuery.data?.length) {
    return null;
  }

  /**
   * When a batch is revealed / decrypted / non-revealable, its batchUri will be "0x"
   */
  const allBatchesRevealed = batchesQuery.data.every(
    (o) => o.batchUri === "0x",
  );

  if (allBatchesRevealed) {
    return (
      <ToolTipLabel label="All batches are revealed">
        <Button className="gap-2" disabled variant="primary">
          <EyeIcon className="size-4" /> Reveal NFTs
        </Button>
      </ToolTipLabel>
    );
  }

  const onSubmit = async (data: RevealFormData) => {
    const tx = reveal({
      batchId: BigInt(data.batchId),
      contract,
      password: data.password,
    });

    await sendTxMutation.mutateAsync(tx, {
      onError: (error) => {
        toast.error("Failed to reveal batch", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Batch revealed successfully");
        setOpen(false);
      },
    });
  };

  return (
    <MinterOnly contract={contract}>
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button className="gap-2" variant="primary">
            <EyeIcon className="size-4" /> Reveal NFTs
          </Button>
        </SheetTrigger>
        <SheetContent className="!w-full lg:!max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-left">Reveal batch</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form
              className="mt-4 space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="batchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a batch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Select a batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {batchesQuery.data.map((batch) => (
                          <SelectItem
                            disabled={batch.batchUri === "0x"}
                            key={batch.batchId.toString()}
                            value={batch.batchId.toString()}
                          >
                            {batch.placeholderMetadata?.name ||
                              batch.batchId.toString()}{" "}
                            {batch.batchUri === "0x" && "(REVEALED)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="The one you used to upload this batch"
                        type="password"
                        className="bg-card"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <TransactionButton
                  client={contract.client}
                  isLoggedIn={isLoggedIn}
                  isPending={sendTxMutation.isPending}
                  transactionCount={1}
                  txChainID={contract.chain.id}
                  type="submit"
                >
                  Reveal NFTs
                </TransactionButton>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </MinterOnly>
  );
}
