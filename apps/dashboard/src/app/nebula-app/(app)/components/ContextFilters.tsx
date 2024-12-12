"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { MultiNetworkSelector } from "../../../../@/components/blocks/NetworkSelectors";
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <SlidersHorizontalIcon className="size-4" />
          {props.contextFilters
            ? "Edit Context Filters"
            : "Set context filters"}
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
  contractAddresses: z.string().refine(
    (s) => {
      if (s.trim() === "") {
        return true;
      }
      return s.trim().split(",").every(isAddress);
    },
    {
      message:
        "Contract addresses must be a comma-separated list of valid addresses",
    },
  ),
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
    },
    reValidateMode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { chainIds, contractAddresses } = values;
    const chainIdsArray = chainIds.trim().split(",").filter(Boolean);
    const contractAddressesArray = contractAddresses
      .trim()
      .split(",")
      .filter(Boolean);
    if (chainIdsArray.length === 0 && contractAddressesArray.length === 0) {
      props.updateFilters(undefined);
    } else {
      props.updateFilters({
        chainIds: chainIdsArray,
        contractAddresses: contractAddressesArray,
      });
    }
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
