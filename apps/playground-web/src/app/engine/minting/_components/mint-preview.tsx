"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { THIRDWEB_CLIENT } from "@/lib/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { upload } from "thirdweb/storage";
import { isAddress, shortenAddress } from "thirdweb/utils";
import * as z from "zod";
import { UploadImage } from "../../../../components/blocks/upload-image";
import { Spinner } from "../../../../components/ui/Spinner/Spinner";
import { tryCatch } from "../../../../lib/try-catch";
import { useEngineTxStatus } from "../../_hooks/useEngineTxStatus";
import { mint_erc1155_nft_with_engine } from "../../actions";
import type { EngineTxStatus } from "../../types";
import { mintExample } from "../constants";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  walletAddress: z
    .string()
    .min(1, "Required")
    .refine(
      (val) => {
        // don't directly return `isAddress(val)` to avoid typecasting to `0x{string}`
        if (isAddress(val)) {
          return true;
        }

        return false;
      },
      {
        message: "Invalid wallet address",
      },
    ),
  supply: z.coerce.number().int("Must be Integer").min(1, "Required"),
  image: z
    .instanceof(File, {
      message: "Required",
    })
    .refine((file) => {
      // file must not be larger than 500kb
      if (file.size > 500 * 1024) {
        return "Image must not be larger than 500kb";
      }

      return true;
    }),
});

type FormValues = z.infer<typeof formSchema>;

function TransactionStatusIcon({
  status,
  isPending,
}: { status?: string; isPending: boolean }) {
  function getIcon() {
    if (isPending) {
      return <Spinner className="size-4" />;
    }

    switch (status) {
      case "mined":
        return <CheckIcon className="size-4 text-green-500" />;
      case "errored":
      case "cancelled":
        return <XIcon className="size-4 text-red-500" />;
      case "queued":
      case "sent":
        return <Spinner className="size-4" />;
      default:
        return null;
    }
  }

  const icon = getIcon();

  if (!icon) {
    return null;
  }

  return <div className="rounded-full border bg-background p-2">{icon}</div>;
}

function TransactionStatusMessage({
  status,
  isPending,
}: { status?: string; isPending: boolean }) {
  if (isPending) {
    return "Sending Transaction Request";
  }

  switch (status) {
    case "queued":
      return "Transaction Queued";
    case "mined":
      return "Transaction Mined";
    case "sent":
      return "Transaction Sent";
    case "errored":
    case "cancelled":
      return "Transaction Failed";
    default:
      return null;
  }
}

function TransactionHashLink({
  hash,
  explorer,
}: { hash: string; explorer: string }) {
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <span className="block text-muted-foreground text-sm">
      Transaction Hash:{" "}
      <a
        href={`${explorer}/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
        className="font-mono underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground"
      >
        {shortHash}
      </a>
    </span>
  );
}

function TransactionStatus({
  status,
  isPending,
  transactionHash,
}: {
  status?: string;
  isPending: boolean;
  transactionHash?: string | null;
}) {
  return (
    <div className="flex items-center gap-2 text-foreground">
      <TransactionStatusIcon status={status} isPending={isPending} />

      <p className="space-y-0.5">
        <span className="block">
          <TransactionStatusMessage status={status} isPending={isPending} />
        </span>

        {transactionHash && (
          <TransactionHashLink
            hash={transactionHash}
            explorer={mintExample.chainExplorer}
          />
        )}
      </p>
    </div>
  );
}

export function EngineMintPreview() {
  const [queueId, setQueueId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const engineTxStatusQuery = useEngineTxStatus(queueId);
  const [hasSentTx, setHasSentTx] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      walletAddress: "",
      supply: 1,
    },
  });

  const mintMutation = useMutation({
    mutationFn: async (params: {
      address: string;
      name: string;
      description: string;
      image: File;
      supply: string;
    }) => {
      const uploadPromise = upload({
        client: THIRDWEB_CLIENT,
        files: [params.image],
      });

      const uploadResult = await tryCatch(uploadPromise);

      if (uploadResult.error) {
        throw new Error("Failed to upload image");
      }

      return mint_erc1155_nft_with_engine({
        contractAddress: mintExample.contractAddress,
        chainId: mintExample.chainId,
        toAddress: params.address,
        metadataWithSupply: {
          metadata: {
            name: params.name,
            description: params.description,
            image: uploadResult.data,
          },
          supply: params.supply,
        },
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    setHasSentTx(true);
    const result = await mintMutation.mutateAsync({
      address: data.walletAddress,
      name: data.name,
      description: data.description || "",
      image: data.image,
      supply: data.supply.toString(),
    });

    // optimistic update
    queryClient.setQueryData(["engineTxStatus", result], {
      status: "queued",
      chainId: mintExample.chainId.toString(),
      queueId: result,
      transactionHash: null,
      queuedAt: new Date().toISOString(),
      sentAt: null,
      minedAt: null,
      cancelledAt: null,
    } satisfies EngineTxStatus);

    setQueueId(result);
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight"> Example </h2>
      <p className="mb-4 text-muted-foreground">
        Mint ERC1155 NFTs in{" "}
        <a
          href={`https://thirdweb.com/${mintExample.chainId}/${mintExample.contractAddress}`}
          target="_blank"
          className="font-mono underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground"
          rel="noopener noreferrer"
        >
          {shortenAddress(mintExample.contractAddress)}
        </a>{" "}
        contract on {mintExample.chainName}
      </p>

      <div className="w-full rounded-lg border bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 p-4 lg:p-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* left */}
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <UploadImage
                            id="image"
                            onImageUpload={(file) =>
                              form.setValue("image", file)
                            }
                            className="w-full bg-background lg:w-[300px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* right */}
                  <div className="flex grow flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex grow flex-col">
                          <FormLabel>Description</FormLabel>
                          <FormControl className="grow">
                            <Textarea className="grow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-4 lg:flex-row">
                      <FormField
                        control={form.control}
                        name="walletAddress"
                        render={({ field }) => (
                          <FormItem className="grow">
                            <FormLabel>Receiver Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="0x..."
                                className="font-mono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="supply"
                        render={({ field }) => (
                          <FormItem className="lg:w-32">
                            <FormLabel>Supply</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 border-t p-4 lg:p-6">
              <TransactionStatus
                status={engineTxStatusQuery.data?.status}
                isPending={mintMutation.isPending}
                transactionHash={engineTxStatusQuery.data?.transactionHash}
              />

              {!hasSentTx && (
                <Button
                  type="submit"
                  disabled={mintMutation.isPending}
                  className="min-w-36 gap-2"
                >
                  {mintMutation.isPending ? (
                    <Spinner className="size-4" />
                  ) : (
                    <UploadIcon className="size-4" />
                  )}
                  Mint NFT
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
