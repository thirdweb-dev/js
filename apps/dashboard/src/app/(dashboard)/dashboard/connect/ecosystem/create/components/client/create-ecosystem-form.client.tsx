"use client";

import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { z } from "zod";
import { useCreateEcosystem } from "../../hooks/use-create-ecosystem";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Ecosystem name is required",
  }),
  logo: z.instanceof(File, {
    message: "Logo is required",
  }),
  permission: z.union([z.literal("PARTNER_WHITELIST"), z.literal("ANYONE")]),
});

const nameToSlug = (name = "") => `${name.toLowerCase().replaceAll(" ", "-")}`;

export function CreateEcosystemForm() {
  // When set, the confirmation modal is open the this contains the form data to be submitted
  const [formDataToBeConfirmed, setFormDataToBeConfirmed] = useState<
    z.infer<typeof formSchema> | undefined
  >();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission: "PARTNER_WHITELIST",
    },
  });

  const { createEcosystem, isLoading } = useCreateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create ecosystem";
      toast.error(message);
    },
    onSuccess: (id: string) => {
      form.reset();
      router.push(`/dashboard/connect/ecosystem/${id}/permissions`);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            setFormDataToBeConfirmed(values),
          )}
          className="space-y-8"
        >
          <div className="grid space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ecosystem Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Aperture Laboratories" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value
                      ? `ecosystem.${nameToSlug(field.value)}`
                      : "ecosystem.aperture-laboratories"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Ecosystem Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      accept="image/png, image/jpeg"
                      onUpload={(files) => {
                        form.setValue("logo", files[0]);
                        form.clearErrors("logo");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The logo will be displayed as the ecosystem's wallet icon.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integration permissions</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue="PARTNER_WHITELIST"
                      className="flex gap-4 py-2"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItemButton
                            value="PARTNER_WHITELIST"
                            id="PARTNER_WHITELIST"
                          >
                            Allowlist
                          </RadioGroupItemButton>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItemButton value="ANYONE" id="ANYONE">
                            Public
                          </RadioGroupItemButton>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    <Link
                      className="text-primary"
                      href="https://portal.thirdweb.com/connect/ecosystems/ecosystem-permissions"
                    >
                      Learn more
                    </Link>{" "}
                    about ecosystem permissions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="min-w-28"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create
          </Button>
        </form>
      </Form>
      <ConfirmationDialog
        open={formDataToBeConfirmed !== undefined}
        onOpenChange={(open) =>
          !open ? setFormDataToBeConfirmed(undefined) : null
        }
        title={`Are you sure you want to create ecosystem ${nameToSlug(
          form.getValues().name,
        )}?`}
        description="Your account will be charged $250 per month."
        onSubmit={() => {
          invariant(formDataToBeConfirmed, "Form data not found");
          createEcosystem({
            slug: nameToSlug(formDataToBeConfirmed.name),
            name: formDataToBeConfirmed.name,
            logo: formDataToBeConfirmed.logo,
            permission: formDataToBeConfirmed.permission,
          });
        }}
      />
    </>
  );
}
