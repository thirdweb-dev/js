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
import type { Ecosystem, Partner } from "../../../../types";
import { partnerFormSchema } from "../../constants";
import { useUpdatePartner } from "../../hooks/use-update-partner";

export function UpdatePartnerForm({
  ecosystem,
  partner,
  onSuccess,
}: { ecosystem: Ecosystem; partner: Partner; onSuccess: () => void }) {
  const form = useForm<z.input<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: partner.name,
      domains: partner.allowlistedDomains.join(","),
      bundleIds: partner.allowlistedBundleIds.join(","),
    },
  });

  const { mutateAsync: updatePartner, isPending } = useUpdatePartner({
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
  });

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
        <div className="flex flex-col gap-5 grow">
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
                      ? "text-destructive block opacity-100 translate-y-0"
                      : "opacity-0 hidden",
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
                    "text-xs block",
                    form.formState.errors.domains?.message &&
                      "text-destructive translate-y-0 opacity-100 block", // If there are errors show them rather than the tip
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
                    "text-xs block",
                    form.formState.errors.bundleIds?.message &&
                      "text-destructive block",
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
          className="w-full gap-2 mt-4"
        >
          {isPending && <Spinner className="size-4" />}
          Update
        </Button>
      </form>
    </Form>
  );
}
