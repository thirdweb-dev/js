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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress } from "thirdweb";
import { z } from "zod";
import type { NebulaContext } from "../api/chat";

export default function ContextFiltersButton(props: {
  contextFilters: NebulaContext | undefined;
  setContextFilters: (filters: NebulaContext | undefined) => void;
  updateContextFilters: (filters: NebulaContext | undefined) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const chainIds = props.contextFilters?.chainIds;
  const walletAddress = props.contextFilters?.walletAddress;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="max-w-full gap-2">
          <SlidersHorizontalIcon className="size-3.5 shrink-0 text-muted-foreground" />
          Context
          <div className="flex gap-1 overflow-hidden">
            {chainIds && chainIds.length > 0 && (
              <Badge className="gap-1 truncate" variant="secondary">
                Chain
              </Badge>
            )}

            {walletAddress && (
              <Badge className="gap-1 truncate" variant="secondary">
                Wallet
              </Badge>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-1">
          <DialogTitle className="font-semibold text-xl">Context</DialogTitle>
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

const optionalAddressSchema = z
  .string()
  .transform((v) => v.trim())
  .optional()
  .refine(
    (s) => {
      if (!s) {
        return true;
      }
      return isAddress(s);
    },
    {
      message: "Must be a valid addresses",
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
  walletAddress: optionalAddressSchema,
});

export function ContextFiltersForm(props: {
  contextFilters: NebulaContext | undefined;
  updateContextFilters: (filters: NebulaContext | undefined) => Promise<void>;
  setContextFilters: (filters: NebulaContext | undefined) => void;
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
      walletAddress: props.contextFilters?.walletAddress || "",
    },
    reValidateMode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { chainIds, walletAddress } = values;

    const chainIdsArray = chainIds.split(",").filter((id) => id.trim());

    const data = {
      chainIds: chainIdsArray,
      walletAddress: walletAddress || null,
    };

    const promise = updateMutation.mutateAsync(data);

    toast.promise(promise, {
      success: "Context updated",
      error: "Failed to update context",
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
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="0x123.."
                    className="md:text-xs md:placeholder:text-xs"
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
