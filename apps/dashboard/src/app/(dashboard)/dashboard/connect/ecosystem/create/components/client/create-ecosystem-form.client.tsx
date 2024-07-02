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
  RequiredFormLabel,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { AccountStatus, useAccount } from "@3rdweb-sdk/react/hooks/useApi";
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
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
      message: "Name can only contain letters, numbers and spaces",
    }),
  logo: z.instanceof(File, {
    message: "Logo is required",
  }),
  permission: z.union([z.literal("PARTNER_WHITELIST"), z.literal("ANYONE")]),
});

export function CreateEcosystemForm() {
  // When set, the confirmation modal is open the this contains the form data to be submitted
  const [formDataToBeConfirmed, setFormDataToBeConfirmed] = useState<
    z.infer<typeof formSchema> | undefined
  >();
  const { data: billingAccountInfo } = useAccount();

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
    onSuccess: (slug: string) => {
      form.reset();
      // The ecosystem will start in the requested state until payment is processed, so we send the user directly there to minimize redirects
      router.push(`/dashboard/connect/ecosystem/${slug}/requested`);
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            setFormDataToBeConfirmed(values),
          )}
          className="flex flex-col items-stretch gap-8"
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Ecosystem Name</RequiredFormLabel>

                  <FormControl>
                    <Input placeholder="Aperture Laboratories" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <RequiredFormLabel>Ecosystem Logo</RequiredFormLabel>
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
                      className="flex flex-wrap gap-4 py-2"
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
                      target="_blank"
                      href="https://portal.thirdweb.com/connect/ecosystems/ecosystem-permissions"
                    >
                      Learn more about ecosystem permissions
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {billingAccountInfo?.status !== AccountStatus.ValidPayment ? (
            <ToolTipLabel label="Please update your payment method to create an ecosystem">
              {/* Allows the button to be disabled but the tooltip still works */}
              <div className="w-full">
                <Button
                  type="submit"
                  disabled={true}
                  variant="primary"
                  className="w-full opacity-50"
                >
                  Create
                </Button>
              </div>
            </ToolTipLabel>
          ) : (
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Create
            </Button>
          )}
        </form>
      </Form>
      <ConfirmationDialog
        open={formDataToBeConfirmed !== undefined}
        onOpenChange={(open) =>
          !open ? setFormDataToBeConfirmed(undefined) : null
        }
        title={`Are you sure you want to create ecosystem ${form.getValues().name}?`}
        description="Your account will be charged $250 per month."
        onSubmit={() => {
          invariant(formDataToBeConfirmed, "Form data not found");
          createEcosystem({
            name: formDataToBeConfirmed.name,
            logo: formDataToBeConfirmed.logo,
            permission: formDataToBeConfirmed.permission,
          });
        }}
      />
    </>
  );
}
