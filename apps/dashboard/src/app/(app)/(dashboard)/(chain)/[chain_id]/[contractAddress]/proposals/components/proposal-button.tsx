"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import * as VoteExt from "thirdweb/extensions/vote";
import { useSendAndConfirmTransaction } from "thirdweb/react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { parseError } from "@/utils/errorParser";

export function ProposalButton({
  contract,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const sendTx = useSendAndConfirmTransaction();
  const form = useForm<{ description: string }>({
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(data: { description: string }) {
    const tx = VoteExt.propose({
      calldatas: ["0x"],
      contract,
      description: data.description,
      targets: [contract.address],
      values: [0n],
    });

    await sendTx.mutateAsync(tx, {
      onError: (error) => {
        toast.error("Failed to create proposal", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Proposal created successfully");
        setOpen(false);
      },
    });
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className="gap-2" size="sm">
          <PlusIcon className="size-3.5" />
          Create Proposal
        </Button>
      </SheetTrigger>
      <SheetContent className="!w-full lg:!max-w-lg">
        <SheetHeader>
          <SheetTitle>Create new proposal</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-4 flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-card"
                      placeholder="Enter proposal description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                required: "Description is required",
              }}
            />

            <div className="mt-6 flex flex-row justify-end gap-3">
              <Button
                disabled={sendTx.isPending}
                onClick={() => setOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <TransactionButton
                client={contract.client}
                isLoggedIn={isLoggedIn}
                isPending={sendTx.isPending}
                transactionCount={1}
                txChainID={contract.chain.id}
                type="submit"
              >
                Submit
              </TransactionButton>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
