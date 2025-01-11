"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import type { Ecosystem, Partner } from "../../../../../types";
import { partnerFormSchema } from "../../constants";
import { useUpdatePartner } from "../../hooks/use-update-partner";

export function UpdatePartnerForm({
  ecosystem,
  partner,
  onSuccess,
  authToken,
}: {
  ecosystem: Ecosystem;
  partner: Partner;
  onSuccess: () => void;
  authToken: string;
}) {
  const form = useForm<z.input<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: partner.name,
      domains: partner.allowlistedDomains.join(","),
      bundleIds: partner.allowlistedBundleIds.join(","),
    },
  });

  const { mutateAsync: updatePartner, isPending } = useUpdatePartner(
    {
      authToken,
    },
    {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to add ecosystem partner";
        toast.error(message);
      },
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          updatePartner({
            ecosystem,
            partnerId: partner.id,
            name: values.name,
            allowlistedDomains: values.domains
              .split(/,| /)
              .filter((d) => d.length > 0),
            allowlistedBundleIds: values.bundleIds
              .split(/,| /)
              .filter((d) => d.length > 0),
          });
        })}
        className="flex flex-col gap-4"
      >
        <div className="flex grow flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel> Name </FormLabel>
                <FormControl>
                  <Input
                    placeholder="App name"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormDescription
                  className={cn(
                    "text-xs transition-all",
                    form.formState.errors.name?.message
                      ? "block translate-y-0 text-destructive opacity-100"
                      : "hidden opacity-0",
                  )}
                >
                  {form.formState.errors.name?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domains"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4 lg:col-span-4">
                <FormLabel> Domains </FormLabel>
                <FormControl>
                  <Input placeholder="Domains" className="peer" {...field} />
                </FormControl>
                <FormDescription
                  className={cn(
                    "block text-xs",
                    form.formState.errors.domains?.message &&
                      "block translate-y-0 text-destructive opacity-100", // If there are errors show them rather than the tip
                  )}
                >
                  {form.formState.errors.domains?.message ??
                    "Space or comma-separated list of regex domains (e.g. *.example.com)"}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bundleIds"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormLabel> Bundle ID </FormLabel>
                <FormControl>
                  <Input placeholder="Bundle ID" className="peer" {...field} />
                </FormControl>
                <FormDescription
                  className={cn(
                    "block text-xs",
                    form.formState.errors.bundleIds?.message &&
                      "block text-destructive",
                  )}
                >
                  {form.formState.errors.bundleIds?.message ??
                    "Space or comma-separated list of bundle IDs"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="mt-4 w-full gap-2"
        >
          {isPending && <Spinner className="size-4" />}
          Update
        </Button>
      </form>
    </Form>
  );
}
