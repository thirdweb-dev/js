"use client";

import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AutoResizeTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-1">
          <DialogTitle className="font-semibold text-xl">
            Context Filters
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Provide context to Nebula for your prompts
          </DialogDescription>
        </DialogHeader>

        <ContextFiltersForm
          contextFilters={props.contextFilters}
          updateContextFilters={props.updateContextFilters}
          setContextFilters={props.setContextFilters}
          modal={{
            close: () => setIsOpen(false),
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

export function ContextFiltersForm(props: {
  contextFilters: ContextFilters | undefined;
  updateContextFilters: (filters: ContextFilters | undefined) => Promise<void>;
  setContextFilters: (filters: ContextFilters | undefined) => void;
  formBodyClassName?: string;
  formActionContainerClassName?: string;
  modal:
    | {
        close: () => void;
      }
    | undefined;
}) {
  const updateMutation = useMutation({
    mutationFn: props.updateContextFilters,
  });

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

    const data = {
      chainIds: chainIdsArray,
      contractAddresses: contractAddressesArray,
      walletAddresses: walletAddressesArray,
    };

    const promise = updateMutation.mutateAsync(data);

    toast.promise(promise, {
      success: "Context filters updated",
      error: "Failed to update context filters",
    });

    promise.then(() => {
      props.setContextFilters(data);
      props.modal?.close?.();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex w-full grow flex-col")}
      >
        <div
          className={cn(
            "flex flex-col gap-5 px-6 pb-6",
            props.formBodyClassName,
          )}
        >
          <FormField
            control={form.control}
            name="chainIds"
            render={() => (
              <FormItem>
                <FormLabel>Chain IDs</FormLabel>
                <FormControl>
                  <MultiNetworkSelector
                    disableChainId
                    className="bg-background"
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
                    className="!leading-relaxed min-h-[52px] resize-none md:text-xs"
                  />
                </FormControl>
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
                    className="!leading-relaxed min-h-[52px] resize-none md:text-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div
          className={cn(
            "flex justify-end gap-3 border-t bg-card p-6",
            props.formActionContainerClassName,
          )}
        >
          {props.modal && (
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
          )}
          <Button
            className="min-w-24 gap-2"
            type="submit"
            size="sm"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && <Spinner className="size-4" />}
            Update Context
          </Button>
        </div>
      </form>
    </Form>
  );
}
