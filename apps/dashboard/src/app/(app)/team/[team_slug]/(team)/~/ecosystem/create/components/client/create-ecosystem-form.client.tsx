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
  RequiredFormLabel,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createEcosystem } from "../../actions/create-ecosystem";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .refine((name) => /^[a-zA-Z0-9 ]*$/.test(name), {
      message: "Name can only contain letters, numbers and spaces",
    }),
  logo: z
    .instanceof(File, {
      message: "Logo is required",
    })
    .refine((file) => file.size <= 500 * 1024, {
      message: "Logo size must be less than 500KB",
    }),
  permission: z.union([z.literal("PARTNER_WHITELIST"), z.literal("ANYONE")]),
});

export function CreateEcosystemForm(props: {
  teamSlug: string;
  teamId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission: "PARTNER_WHITELIST",
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex grow flex-col"
        onSubmit={form.handleSubmit(async (values) => {
          const res = await createEcosystem({
            teamSlug: props.teamSlug,
            teamId: props.teamId,
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
          <div>
            <h2 className="font-semibold text-2xl tracking-tight">
              Create Ecosystem
            </h2>
            <p className="text-muted-foreground">
              Create wallets that work across every chain and every app
            </p>
          </div>

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
                    className="bg-background"
                    accept="image/png, image/jpeg"
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
                    onValueChange={field.onChange}
                    defaultValue="PARTNER_WHITELIST"
                    className="flex flex-wrap gap-4 py-2"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItemButton
                          value="PARTNER_WHITELIST"
                          id="PARTNER_WHITELIST"
                          className="bg-background"
                        >
                          Allowlist
                        </RadioGroupItemButton>
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <RadioGroupItemButton
                          value="ANYONE"
                          id="ANYONE"
                          className="bg-background"
                        >
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

        <div className="h-5" />

        <div className="mt-auto flex justify-end border-t p-4 lg:p-6">
          <Button
            type="submit"
            className="gap-2"
            disabled={form.formState.isSubmitting}
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
