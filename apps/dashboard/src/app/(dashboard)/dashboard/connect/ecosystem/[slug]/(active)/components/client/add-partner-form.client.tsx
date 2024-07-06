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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ToolTipLabel } from "../../../../../../../../../@/components/ui/tooltip";
import type { Ecosystem } from "../../../../types";
import { useAddPartner } from "../../hooks/use-add-partner";

const isDomainRegex =
  /^(?:\*|localhost(?::\d{1,5})?|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])$/;
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
      message: "Name can only contain letters, numbers and spaces",
    }),
  domains: z
    .string()
    .trim()
    .transform((s) => s.split(/,| /).filter((d) => d.length > 0))
    .refine((domains) => domains.every((d) => isDomainRegex.test(d)), {
      message: "Invalid domain format", // This error message CANNOT be within the array iteration, or the FormMessage won't be able to find it in the form state
    })
    .transform((s) => s.join(",")), // This is rejoined to return a string (and later split again) since react-hook-form's typings can't hnadle different input vs output types
  bundleIds: z
    .string()
    .trim()
    .transform((s) =>
      s
        .split(/,| /)
        .filter((d) => d.length > 0)
        .join(","),
    ),
  permissions: z
    .string({
      required_error: "Please specify wallet permissions",
    }) // We use a string rather than an enum here so the defualt value will work
    .refine((p) => ["PROMPT_USER_V1", "FULL_CONTROL_V1"].includes(p), {
      message: "Invalid permissions setting",
    }),
});

export function AddPartnerForm({ ecosystem }: { ecosystem: Ecosystem }) {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { addPartner, isLoading } = useAddPartner({
    onSuccess: () => {
      form.reset();
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
          addPartner({
            ecosystem,
            name: values.name,
            allowlistedDomains: values.domains
              .split(/,| /)
              .filter((d) => d.length > 0),
            allowlistedBundleIds: values.bundleIds
              .split(/,| /)
              .filter((d) => d.length > 0),
            permissions: [
              values.permissions as unknown as
                | "FULL_CONTROL_V1"
                | "PROMPT_USER_V1",
            ],
          });
        })}
        className="flex flex-col gap-2 lg:flex-row"
      >
        <div className="grid gap-2 lg:grid-cols-12 grow">
          <FormField
            control={form.control}
            name="name"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4 lg:col-span-3">
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
                      : "opacity-0 lg:-translate-y-4 hidden",
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
                        "hidden text-xs transition-all lg:block lg:-translate-y-4 lg:opacity-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0",
                        form.formState.errors.domains?.message &&
                          "text-destructive lg:translate-y-0 lg:opacity-100 block", // If there are errors show them rather than the tip
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
              <FormItem className="col-span-4 lg:col-span-3">
                <FormControl>
                  <>
                    <Input
                      placeholder="Bundle ID"
                      className="peer"
                      {...field}
                    />
                    <FormDescription
                      className={cn(
                        "hidden text-xs transition-all lg:block lg:-translate-y-4 lg:opacity-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0",
                        form.formState.errors.bundleIds?.message &&
                          "text-destructive translate-y-0 opacity-100 block",
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
              <FormItem className="col-span-4 lg:col-span-2">
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
                      "hidden text-xs transition-all lg:block lg:-translate-y-4 lg:opacity-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0",
                      form.formState.errors.permissions?.message &&
                        "text-destructive lg:translate-y-0 lg:opacity-100 block", // If there are errors show them rather than the tip
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
          className="w-full lg:w-auto"
        >
          Add
        </Button>
      </form>
    </Form>
  );
}
