import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import React from "react";
import { useForm } from "react-hook-form";
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
      <DialogContent className="sm:w-[425px] p-0 gap-0 rounded-2xl overflow-hidden">
        <div className="relative w-full h-[425px]">
          <Image
            src={data.image_url || data.collection.image_url}
            alt={data.name}
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-6 p-6 border border-t-0 rounded-b-2xl">
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
            <div className="flex items-start justify-end h-full col-span-1">
              <Badge variant="secondary">{chainData?.name}</Badge>
            </div>
          </DialogHeader>
          {account?.address === params.address && (
            <DialogFooter>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col w-full space-y-4"
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
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
