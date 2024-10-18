"use client";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import invariant from "tiny-invariant";
import { type Ecosystem, authOptions } from "../../../../types";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

export function AuthOptionsForm({ ecosystem }: { ecosystem: Ecosystem }) {
  const [messageToConfirm, setMessageToConfirm] = useState<
    | {
        title: string;
        description: string;
        authOptions: typeof ecosystem.authOptions;
      }
    | undefined
  >();
  const {
    mutateAsync: updateEcosystem,
    variables,
    isPending,
  } = useUpdateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update ecosystem";
      toast.error(message);
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-2">
        {authOptions.map((option) => (
          <CheckboxWithLabel
            key={option}
            className={cn(
              isPending &&
                variables?.authOptions?.includes(option) &&
                "animate-pulse",
              "hover:cursor-pointer hover:text-foreground",
            )}
          >
            <Checkbox
              checked={ecosystem.authOptions?.includes(option)}
              onClick={() => {
                if (ecosystem.authOptions?.includes(option)) {
                  setMessageToConfirm({
                    title: `Are you sure you want to remove ${option.slice(0, 1).toUpperCase() + option.slice(1)} as an authentication option for this ecosystem?`,
                    description:
                      "Users will no longer be able to log into your ecosystem using this option. Any users that previously used this option will be unable to log in.",
                    authOptions: ecosystem.authOptions?.filter(
                      (o) => o !== option,
                    ),
                  });
                } else {
                  setMessageToConfirm({
                    title: `Are you sure you want to add ${option.slice(0, 1).toUpperCase() + option.slice(1)} as an authentication option for this ecosystem?`,
                    description:
                      "Users will be able to log into your ecosystem using this option. If you later remove this option users that used it will no longer be able to log in.",
                    authOptions: [...ecosystem.authOptions, option],
                  });
                }
              }}
            />
            {option.slice(0, 1).toUpperCase() + option.slice(1)}
          </CheckboxWithLabel>
        ))}
        <ConfirmationDialog
          open={!!messageToConfirm}
          onOpenChange={(open) => {
            if (!open) {
              setMessageToConfirm(undefined);
            }
          }}
          title={messageToConfirm?.title}
          description={messageToConfirm?.description}
          onSubmit={() => {
            invariant(
              messageToConfirm,
              "Must have message for modal to be open",
            );
            updateEcosystem({
              ...ecosystem,
              authOptions: messageToConfirm.authOptions,
            });
          }}
        />
      </div>
      <CustomAuthOptionsForm ecosystem={ecosystem} />
    </div>
  );
}

function CustomAuthOptionsForm({ ecosystem }: { ecosystem: Ecosystem }) {
  const form = useForm({
    defaultValues: {
      customAuthEndpoint: ecosystem.customAuthOptions?.authEndpoint?.url,
      customHeaders: ecosystem.customAuthOptions?.authEndpoint?.headers,
    },
  });
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "customHeaders",
  });
  const { mutateAsync: updateEcosystem, isPending } = useUpdateEcosystem({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update ecosystem";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Custom Auth Options updated");
    },
  });
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-semibold text-2xl text-foreground">
        Custom Auth Options
      </h4>
      <Card className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-4">
          <Form {...form}>
            <FormField
              control={form.control}
              name="customAuthEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authentication Endpoint</FormLabel>
                  <FormDescription>
                    Enter the URL for your own authentication endpoint.{" "}
                    <a
                      className="underline"
                      href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/configuration#generic-auth"
                    >
                      Learn more.
                    </a>
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://your-custom-auth-endpoint.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customHeaders"
              render={() => (
                <FormItem>
                  <FormLabel>Headers</FormLabel>
                  <FormDescription>
                    Optional: Add headers for your authentication endpoint
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-2">
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-2">
                          <Input
                            placeholder="Header Key"
                            {...form.register(`customHeaders.${index}.key`)}
                          />
                          <Input
                            placeholder="Header Value"
                            {...form.register(`customHeaders.${index}.value`)}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append({ key: "", value: "" })}
                      >
                        Add Header
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={isPending}
                type="submit"
                onClick={() => {
                  const customAuthEndpoint =
                    form.getValues("customAuthEndpoint");
                  let customAuthOptions:
                    | Ecosystem["customAuthOptions"]
                    | undefined = undefined;
                  if (customAuthEndpoint) {
                    try {
                      const url = new URL(customAuthEndpoint);
                      invariant(url.hostname, "Invalid URL");
                    } catch {
                      toast.error("Invalid URL");
                      return;
                    }
                    const customHeaders = form.getValues("customHeaders");
                    customAuthOptions = {
                      authEndpoint: {
                        url: customAuthEndpoint,
                        headers: customHeaders,
                      },
                    };
                  }
                  updateEcosystem({
                    ...ecosystem,
                    customAuthOptions,
                  });
                }}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export function AuthOptionsFormSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-2 md:flex-row md:gap-4">
      {authOptions.map((option) => (
        <Skeleton key={option} className="h-14 w-full md:w-32" />
      ))}
    </div>
  );
}
