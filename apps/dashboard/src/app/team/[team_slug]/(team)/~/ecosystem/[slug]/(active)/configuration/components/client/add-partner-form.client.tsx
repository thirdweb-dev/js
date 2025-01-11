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
import type { Ecosystem } from "../../../../../types";
import { partnerFormSchema } from "../../constants";
import { useAddPartner } from "../../hooks/use-add-partner";

export function AddPartnerForm({
  ecosystem,
  onPartnerAdded,
  authToken,
}: { authToken: string; ecosystem: Ecosystem; onPartnerAdded: () => void }) {
  const form = useForm<z.input<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
  });

  const { mutateAsync: addPartner, isPending } = useAddPartner(
    {
      authToken,
    },
    {
      onSuccess: () => {
        onPartnerAdded();
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
          addPartner({
            ecosystem,
            name: values.name,
            allowlistedDomains: values.domains
              .split(/,| /)
              .filter((d) => d.length > 0),
            allowlistedBundleIds: values.bundleIds
              .split(/,| /)
              .filter((d) => d.length > 0),
          });
        })}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem>
                <FormLabel> App Name </FormLabel>
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
                      : "lg:-translate-y-4 hidden opacity-0",
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
              <FormItem>
                <FormLabel> Domains </FormLabel>
                <FormControl>
                  <Input placeholder="Domains" className="peer" {...field} />
                </FormControl>

                <FormDescription>
                  Space or comma-separated list of regex domains (e.g.
                  *.example.com)
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bundleIds"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem>
                <FormLabel> Bundle ID </FormLabel>
                <FormControl>
                  <Input placeholder="Bundle ID" className="peer" {...field} />
                </FormControl>

                <FormDescription>
                  Space or comma-separated list of bundle IDs
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isPending} type="submit" className="w-full gap-2">
          {isPending && <Spinner className="size-4" />}
          Add
        </Button>
      </form>
    </Form>
  );
}
