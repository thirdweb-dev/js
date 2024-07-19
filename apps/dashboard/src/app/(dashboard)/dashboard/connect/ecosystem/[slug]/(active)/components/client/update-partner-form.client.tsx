"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
      permissions: partner.permissions[0],
    },
  });

  const { updatePartner, isLoading } = useUpdatePartner({
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
            permissions: [values.permissions],
          });
        })}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-4 grow">
          <FormField
            control={form.control}
            name="name"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
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
                <FormControl>
                  <>
                    <Input placeholder="Domains" className="peer" {...field} />
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
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bundleIds"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormControl>
                  <>
                    <Input
                      placeholder="Bundle ID"
                      className="peer"
                      {...field}
                    />
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
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permissions"
            defaultValue="PROMPT_USER_V1" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <ToolTipLabel label="Should wallet actions prompt the user for approval?">
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wallet prompts" />
                      </SelectTrigger>
                    </FormControl>
                  </ToolTipLabel>
                  <SelectContent>
                    <SelectItem value="FULL_CONTROL_V1">
                      Never prompt
                    </SelectItem>
                    <SelectItem value="PROMPT_USER_V1">Prompt user</SelectItem>
                  </SelectContent>

                  <FormDescription
                    className={cn(
                      "hidden text-xs transition-all peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0",
                      form.formState.errors.permissions?.message &&
                        "text-destructive block", // If there are errors show them rather than the tip
                    )}
                  >
                    {form.formState.errors.permissions?.message ??
                      "Wallet signing"}
                  </FormDescription>
                </Select>
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          variant="outline"
          className="w-full"
        >
          {isLoading && <Loader2 className="size-4 mr-1 animate-spin" />}
          Update
        </Button>
      </form>
    </Form>
  );
}
