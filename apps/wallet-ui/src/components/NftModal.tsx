"use client";
import { Image } from "@/components/ui/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, OctagonXIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Address } from "thirdweb";
import { defineChain, getContract, isAddress, sendTransaction } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { transferFrom } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import invariant from "tiny-invariant";
import { z } from "zod";
import { client } from "../lib/client";
import { revalidate } from "../lib/revalidate";
import type { Erc721Token } from "../types/Erc721Token";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const TransferFormSchema = z.object({
  recipient: z.string().refine((value) => isAddress(value), {
    message: "Invalid address",
  }),
});

export function NftModal({
  children,
  data,
  chainData,
}: {
  children: React.ReactNode;
  data: Erc721Token;
  chainData?: ChainMetadata;
}) {
  const account = useActiveAccount();
  const params = useParams<{ address: string }>();
  const [open, setIsOpen] = React.useState(false);

  const contract = useMemo(
    () =>
      getContract({
        client,
        address: data.contractAddress,
        chain: defineChain(data.chainId),
      }),
    [data.chainId, data.contractAddress],
  );

  const {
    mutateAsync: transfer,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (formData: z.infer<typeof TransferFormSchema>) => {
      invariant(account, "No account found");
      const transaction = transferFrom({
        contract,
        from: account?.address as Address,
        to: formData.recipient,
        tokenId: BigInt(data.tokenId),
      });

      return sendTransaction({ transaction, account });
    },
    onError: (e, { recipient }) => {
      toast.error("Transaction failed", {
        id: "fail",
        description: e.message,
        icon: <OctagonXIcon className="h-4 w-4" />,
        duration: 5000,
        action: (
          <Button
            onClick={() => {
              toast.dismiss("fail");
              transfer({ recipient });
            }}
          >
            Retry
          </Button>
        ),
      });
    },
  });

  const form = useForm<z.infer<typeof TransferFormSchema>>({
    resolver: zodResolver(TransferFormSchema),
    defaultValues: {
      recipient: "" as Address,
    },
  });

  async function onSubmit(values: z.infer<typeof TransferFormSchema>) {
    invariant(chainData, "No chain data found");
    await transfer(values);
    setIsOpen(false);
    form.reset();
    revalidate(`${chainData.chainId}-${params.address}`);
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button type="button">{children}</button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-xl p-0 sm:w-[425px] md:rounded-xl">
        <div className="relative h-[425px] w-full">
          <Image
            src={data.image_url || data.collection.image_url}
            alt={data.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 border border-t-0 p-6 md:rounded-b-xl">
          <DialogHeader className="grid grid-cols-4 gap-2 space-y-0">
            <div className="col-span-3">
              <DialogTitle className="mb-1">
                {data.name || data.collection.name || data.contract.name}
              </DialogTitle>
              <DialogDescription>
                {chainData?.explorers?.length ? (
                  <Link
                    target="_blank"
                    className="hover:underline"
                    href={`${chainData.explorers[0].url}/address/${data.contractAddress}`}
                  >
                    {shortenAddress(data.contractAddress)}
                  </Link>
                ) : (
                  shortenAddress(data.contractAddress)
                )}
              </DialogDescription>
            </div>
            <div className="col-span-1 flex h-full items-start justify-end">
              <Badge variant="secondary">{chainData?.name}</Badge>
            </div>
          </DialogHeader>
          {account?.address === params.address && (
            <DialogFooter>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Recipient address" {...field} />
                        </FormControl>
                        <FormMessage>{error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} type="submit">
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Transfer
                  </Button>
                </form>
              </Form>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
