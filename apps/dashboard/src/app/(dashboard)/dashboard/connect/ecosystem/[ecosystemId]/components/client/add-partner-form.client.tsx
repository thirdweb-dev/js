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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAddPartner } from "../../hooks/use-add-partner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Partner name is required",
  }),
  domains: z
    .string()
    .transform((value) => value.split(/,| /))
    .pipe(z.string().array())
    .optional(),
  bundleIds: z
    .string()
    .transform((value) => value.split(/,| /))
    .pipe(z.string().array())
    .optional(),
});

export function AddPartnerForm({ ecosystemId }: { ecosystemId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
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
        onSubmit={form.handleSubmit((values) =>
          addPartner({
            ecosystemId: ecosystemId,
            name: values.name,
            allowlistedDomains: values.domains ?? [],
            allowlistedBundleIds: values.bundleIds ?? [],
            permissions: "PROMPT_USER_V1",
          }),
        )}
        className="flex space-x-2"
      >
        <div className="grid grid-cols-11 space-x-2 grow">
          <FormField
            control={form.control}
            name="name"
            defaultValue="" // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormControl>
                  <Input
                    placeholder="App name"
                    {...field}
                    value={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domains"
            defaultValue={[]} // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormControl>
                  <>
                    <Input placeholder="Domains" className="peer" {...field} />
                    <FormDescription className="text-xs transition-all -translate-y-4 opacity-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0">
                      Space-separated list of domains to allow
                    </FormDescription>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bundleIds"
            defaultValue={[]} // Note: you *must* provide a default value here or the field won't reset
            render={({ field }) => (
              <FormItem className="col-span-4">
                <FormControl>
                  <>
                    <Input
                      placeholder="Bundle ID"
                      className="peer"
                      {...field}
                    />
                    <FormDescription className="text-xs transition-all -translate-y-4 opacity-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0">
                      Space-separated list of bundle IDs
                    </FormDescription>
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isLoading} type="submit" variant="outline">
          Add
        </Button>
      </form>
    </Form>
  );
}
