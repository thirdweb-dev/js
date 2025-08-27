"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { upload } from "thirdweb/storage";
import { isAddress, shortenAddress } from "thirdweb/utils";
import * as z from "zod";
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
import { UploadImage } from "../../../../components/blocks/upload-image";
import { Spinner } from "../../../../components/ui/Spinner";
import { tryCatch } from "../../../../lib/try-catch";
import { useEngineTxStatus } from "../../_hooks/useEngineTxStatus";
import { mint_erc1155_nft_with_engine } from "../../actions";
import type { EngineTxStatus } from "../../types";
import { mintExample } from "../constants";

const formSchema = z.object({
  description: z.string().optional(),
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
  name: z.string().min(1, "Required"),
  supply: z.coerce.number().int("Must be Integer").min(1, "Required"),
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
});

type FormValues = z.infer<typeof formSchema>;

function TransactionStatusIcon({
  status,
  isPending,
}: {
  status?: string;
  isPending: boolean;
}) {
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
}: {
  status?: string;
  isPending: boolean;
}) {
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
}: {
  hash: string;
  explorer: string;
}) {
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <span className="block text-muted-foreground text-sm">
      Transaction Hash:{" "}
      <a
        className="font-mono underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground"
        href={`${explorer}/tx/${hash}`}
        rel="noreferrer"
        target="_blank"
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
      <TransactionStatusIcon isPending={isPending} status={status} />

      <p className="space-y-0.5">
        <span className="block">
          <TransactionStatusMessage isPending={isPending} status={status} />
        </span>

        {transactionHash && (
          <TransactionHashLink
            explorer={mintExample.chainExplorer}
            hash={transactionHash}
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
    defaultValues: {
      description: "",
      name: "",
      supply: 1,
      walletAddress: "",
    },
    resolver: zodResolver(formSchema),
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
        chainId: mintExample.chainId,
        contractAddress: mintExample.contractAddress,
        metadataWithSupply: {
          metadata: {
            description: params.description,
            image: uploadResult.data,
            name: params.name,
          },
          supply: params.supply,
        },
        toAddress: params.address,
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    setHasSentTx(true);
    const result = await mintMutation.mutateAsync({
      address: data.walletAddress,
      description: data.description || "",
      image: data.image,
      name: data.name,
      supply: data.supply.toString(),
    });

    // optimistic update
    queryClient.setQueryData(["engineTxStatus", result], {
      cancelledAt: null,
      chainId: mintExample.chainId.toString(),
      minedAt: null,
      queuedAt: new Date().toISOString(),
      queueId: result,
      sentAt: null,
      status: "queued",
      transactionHash: null,
    } satisfies EngineTxStatus);

    setQueueId(result);
  };

  return (
    <div>
      <h2 className="font-semibold text-2xl tracking-tight"> Example </h2>
      <p className="mb-4 text-muted-foreground">
        Mint ERC1155 NFTs in{" "}
        <a
          className="font-mono underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground"
          href={`https://thirdweb.com/${mintExample.chainId}/${mintExample.contractAddress}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {shortenAddress(mintExample.contractAddress)}
        </a>{" "}
        contract on {mintExample.chainName}
      </p>

      <div className="w-full rounded-lg border bg-card">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                            className="w-full bg-background lg:w-[300px]"
                            onImageUpload={(file) =>
                              form.setValue("image", file)
                            }
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
                                className="font-mono"
                                placeholder="0x..."
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
                              <Input min="1" type="number" {...field} />
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
                isPending={mintMutation.isPending}
                status={engineTxStatusQuery.data?.status}
                transactionHash={engineTxStatusQuery.data?.transactionHash}
              />

              {!hasSentTx && (
                <Button
                  className="min-w-36 gap-2"
                  disabled={mintMutation.isPending}
                  type="submit"
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
