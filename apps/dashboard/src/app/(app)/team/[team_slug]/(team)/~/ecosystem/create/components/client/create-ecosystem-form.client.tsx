"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { createEcosystem } from "../../actions/create-ecosystem";

const formSchema = z.object({
  logo: z
    .instanceof(File, {
      message: "Logo is required",
    })
    .refine((file) => file.size <= 500 * 1024, {
      message: "Logo size must be less than 500KB",
    }),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
      message: "Name can only contain letters, numbers and spaces",
    }),
  permission: z.union([z.literal("PARTNER_WHITELIST"), z.literal("ANYONE")]),
});

export function CreateEcosystemForm(props: {
  teamSlug: string;
  teamId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      permission: "PARTNER_WHITELIST",
    },
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        className="flex grow flex-col"
        onSubmit={form.handleSubmit(async (values) => {
          const res = await createEcosystem({
            teamId: props.teamId,
            teamSlug: props.teamSlug,
            ...values,
          });
          switch (res.status) {
            case 401: {
              toast.error("Please login to create an ecosystem");
              break;
            }
            case 403: {
              toast.error(
                "You are not authorized to create an ecosystem, please ask your team owner to create it.",
              );
              break;
            }
            case 409: {
              toast.error("An ecosystem with that name already exists.");
              break;
            }
            // any other status code treat as a random failure
            default: {
              toast.error(
                "Failed to create ecosystem, please try again later.",
              );
            }
          }
        })}
      >
        <div className="grid gap-6 p-4 lg:p-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel>Ecosystem Name</RequiredFormLabel>

                <FormControl>
                  <Input
                    placeholder="Aperture Laboratories"
                    {...field}
                    className="bg-background"
                  />
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
                    className="bg-background"
                    onUpload={(files) => {
                      if (files[0]) {
                        form.setValue("logo", files[0], {
                          shouldValidate: true,
                        });
                      }
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
                    className="flex flex-wrap gap-4 py-2"
                    defaultValue="PARTNER_WHITELIST"
                    onValueChange={field.onChange}
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItemButton
                          className="bg-background"
                          value="PARTNER_WHITELIST"
                        >
                          Allowlist
                        </RadioGroupItemButton>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItemButton
                          className="bg-background"
                          value="ANYONE"
                        >
                          Public
                        </RadioGroupItemButton>
                      </FormControl>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  <UnderlineLink
                    href="https://portal.thirdweb.com/wallets/ecosystem/set-up#Set%20Ecosystem%20Permissions"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Learn more about ecosystem permissions
                  </UnderlineLink>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-5" />

        <div className="mt-auto flex justify-end border-t p-4 lg:p-6">
          <Button
            className="gap-2"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Create Ecosystem
            {form.formState.isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <ArrowRightIcon className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
