"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Code2Icon, ExternalLinkIcon, PlayIcon, RssIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MediaRenderer } from "thirdweb/react";
import { isAddress, shortenAddress } from "thirdweb/utils";
import * as z from "zod";
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
import { CodeClient } from "../../../../components/code/code.client";
import { Label } from "../../../../components/ui/label";
import { Spinner } from "../../../../components/ui/Spinner";
import { THIRDWEB_CLIENT } from "../../../../lib/client";
import { useEngineTxStatus } from "../../_hooks/useEngineTxStatus";
import { claim_erc1155_nft_with_engine } from "../../actions";
import { claimExample } from "../constants";

const formSchema = z.object({
  receiverAddress: z
    .string()
    .min(1, "Required")
    .refine(
      (value) => {
        if (isAddress(value)) {
          return true;
        }
        return false;
      },
      {
        message: "Invalid address",
      },
    ),
});

export function EngineWebhooksPreview() {
  const [queueId, setQueueId] = useState<string | undefined>(undefined);
  const engineTxStatusQuery = useEngineTxStatus(queueId);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      receiverAddress: "",
    },
    resolver: zodResolver(formSchema),
  });

  const claimMutation = useMutation({
    mutationFn: async (address: string) => {
      const response = await claim_erc1155_nft_with_engine({
        chainId: claimExample.chainId,
        contractAddress: claimExample.contractAddress,
        quantity: 1,
        receiverAddress: address,
        tokenId: claimExample.tokenId,
      });
      return response;
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await claimMutation.mutateAsync(values.receiverAddress);
    setQueueId(res);
  }

  return (
    <div className="grid w-full grid-cols-1 rounded-lg border bg-card lg:grid-cols-[500px_1fr]">
      <div>
        <TabName icon={PlayIcon} name="Claim NFT" />
        <Form {...form}>
          <form
            className="w-full space-y-6 p-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* contract & Network */}
            <div className="space-y-1">
              <Label htmlFor="contract-address">Contract</Label>
              <a
                className="flex items-center gap-2 font-mono text-muted-foreground text-sm underline decoration-muted-foreground/50 underline-offset-4 hover:text-foreground"
                href={`https://thirdweb.com/${claimExample.chainId}/${claimExample.contractAddress}`}
                rel="noreferrer"
                target="_blank"
              >
                {shortenAddress(claimExample.contractAddress)}{" "}
                <ExternalLinkIcon className="size-3" />
              </a>
            </div>

            <div className="space-y-1">
              <Label htmlFor="receiver-address">NFT</Label>
              <MediaRenderer
                className="aspect-square w-48 rounded-lg border"
                client={THIRDWEB_CLIENT}
                src={claimExample.mediaURI}
                style={{
                  height: "192px",
                  width: "192px",
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="receiverAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    1 NFT will be sent to receiver address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full gap-2"
              disabled={claimMutation.isPending}
              type="submit"
            >
              {claimMutation.isPending && <Spinner className="size-4" />}
              Claim NFT
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex min-h-[400px] grow flex-col border-t lg:border-t-0 lg:border-l">
        <TabName icon={Code2Icon} name="Webhook payload" />
        {engineTxStatusQuery.data ? (
          <div className="flex grow flex-col">
            <CodeClient
              className="grow rounded-none border-none"
              code={JSON.stringify(engineTxStatusQuery.data, null, 2)}
              lang="json"
              scrollableContainerClassName="h-full"
            />
          </div>
        ) : (
          <div className="flex grow flex-col items-center justify-center p-6">
            <div className="mb-4 flex items-center rounded-full border bg-background p-2">
              <RssIcon className="size-5" />
            </div>
            <p className="mb-1 text-center text-base text-foreground">
              Webhook not called yet
            </p>
            <p className="text-balance text-center text-muted-foreground text-sm">
              Claim the NFT to see the webhook payload here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabName(props: {
  name: string;
  icon: React.FC<{ className: string }>;
}) {
  return (
    <div className="flex items-center gap-2 border-b p-4 text-muted-foreground text-sm">
      <props.icon className="size-4" />
      {props.name}
    </div>
  );
}
