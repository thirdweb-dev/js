"use client";

import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress } from "thirdweb";
import { z } from "zod";
import type { ContextFilters } from "../api/chat";

export default function ContextFiltersButton(props: {
  contextFilters: ContextFilters | undefined;
  setContextFilters: (filters: ContextFilters | undefined) => void;
  updateContextFilters: (filters: ContextFilters | undefined) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const updateMutation = useMutation({
    mutationFn: props.updateContextFilters,
  });

  const chainIds = props.contextFilters?.chainIds;
  const contractAddresses = props.contextFilters?.contractAddresses;
  const walletAddresses = props.contextFilters?.walletAddresses;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="max-w-full gap-2">
          <SlidersHorizontalIcon className="size-3.5 shrink-0 text-muted-foreground" />
          Context Filters
          <div className="flex gap-1 overflow-hidden">
            {chainIds && chainIds.length > 0 && (
              <Badge className="gap-1 truncate" variant="secondary">
                Chain
                <span className="max-sm:hidden">{chainIds.join(", ")}</span>
              </Badge>
            )}

            {contractAddresses && contractAddresses.length > 0 && (
              <Badge className="gap-1 truncate" variant="secondary">
                Contract
                <span className="max-sm:hidden">
                  {contractAddresses
                    .map((add) => `${add.trim().slice(0, 6)}..`)
                    .join(", ")}
                </span>
              </Badge>
            )}

            {walletAddresses && walletAddresses.length > 0 && (
              <Badge className="gap-1 truncate" variant="secondary">
                Wallet
                <span className="max-sm:hidden">
                  {walletAddresses
                    .map((add) => `${add.trim().slice(0, 6)}..`)
                    .join(", ")}
                </span>
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <ContextFilterDialogContent
          contextFilters={props.contextFilters}
          isPending={updateMutation.isPending}
          updateFilters={async (data) => {
            const promise = updateMutation.mutateAsync(data);
            toast.promise(promise, {
              success: "Context filters updated",
              error: "Failed to update context filters",
            });

            promise.then(() => {
              props.setContextFilters(data);
              setIsOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

const commaSeparateListOfAddresses = z.string().refine(
  (s) => {
    if (s.trim() === "") {
      return true;
    }
    return s.split(",").every((s) => isAddress(s.trim()));
  },
  {
    message: "Must be a comma-separated list of valid addresses",
  },
);

const formSchema = z.object({
  chainIds: z.string().refine(
    (s) => {
      if (s.trim() === "") {
        return true;
      }
      return s
        .trim()
        .split(",")
        .every((id) => Number.isInteger(Number(id)));
    },
    {
      message: "Chain IDs must be a comma-separated list of integers",
    },
  ),
  contractAddresses: commaSeparateListOfAddresses,
  walletAddresses: commaSeparateListOfAddresses,
});

function ContextFilterDialogContent(props: {
  contextFilters: ContextFilters | undefined;
  updateFilters: (filters: ContextFilters | undefined) => void;
  isPending: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      chainIds: props.contextFilters?.chainIds
        ? props.contextFilters.chainIds.join(",")
        : "",
      contractAddresses: props.contextFilters?.contractAddresses
        ? props.contextFilters.contractAddresses.join(",")
        : "",
      walletAddresses: props.contextFilters?.walletAddresses
        ? props.contextFilters.walletAddresses.join(",")
        : "",
    },
    reValidateMode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { chainIds, contractAddresses, walletAddresses } = values;

    const chainIdsArray = chainIds.split(",").filter((id) => id.trim());

    const contractAddressesArray = contractAddresses
      .split(",")
      .filter((v) => v.trim());

    const walletAddressesArray = walletAddresses
      .split(",")
      .filter((v) => v.trim());

    props.updateFilters({
      chainIds: chainIdsArray,
      contractAddresses: contractAddressesArray,
      walletAddresses: walletAddressesArray,
    });
  }

  return (
    <Form {...form}>
      <DialogHeader className="px-6 pt-6 pb-1">
        <DialogTitle className="font-semibold text-xl">
          Context Filters
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Provide context information to Nebula for your prompts
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 px-6">
          <FormField
            control={form.control}
            name="chainIds"
            render={() => (
              <FormItem>
                <FormLabel>Chain IDs</FormLabel>
                <FormControl>
                  <MultiNetworkSelector
                    selectedChainIds={form
                      .watch()
                      .chainIds.split(",")
                      .filter(Boolean)
                      .map(Number)}
                    onChange={(values) => {
                      console.log("values", values);
                      form.setValue("chainIds", values.join(","));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractAddresses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Addresses</FormLabel>
                <FormControl>
                  <AutoResizeTextarea
                    {...field}
                    placeholder="0x123..., 0x456..."
                    className="min-h-[32px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Comma separated list of contract addresses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="walletAddresses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Addresses</FormLabel>
                <FormControl>
                  <AutoResizeTextarea
                    {...field}
                    placeholder="0x123..., 0x456..."
                    className="min-h-[32px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Comma separated list of wallet addresses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-10 flex justify-end gap-3 border-t bg-muted/50 p-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="min-w-28 gap-2" type="submit">
            {props.isPending && <Spinner className="size-4" />}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
