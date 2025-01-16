"use client";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress } from "thirdweb";
import { getSocialIcon } from "thirdweb/wallets/in-app";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";
import invariant from "tiny-invariant";
import { z } from "zod";
import { type Ecosystem, authOptions } from "../../../../../types";
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

type AuthOptionsFormData = {
  authOptions: string[];
  useCustomAuth: boolean;
  customAuthEndpoint: string;
  customHeaders: { key: string; value: string }[];
  useSmartAccount: boolean;
  sponsorGas: boolean;
  defaultChainId: number;
  accountFactoryType: "v0.6" | "v0.7" | "custom";
  customAccountFactoryAddress: string;
};

export function AuthOptionsForm({
  ecosystem,
  authToken,
}: { ecosystem: Ecosystem; authToken: string }) {
  const form = useForm<AuthOptionsFormData>({
    defaultValues: {
      authOptions: ecosystem.authOptions || [],
      useCustomAuth: !!ecosystem.customAuthOptions,
      customAuthEndpoint: ecosystem.customAuthOptions?.authEndpoint?.url || "",
      customHeaders: ecosystem.customAuthOptions?.authEndpoint?.headers || [],
      useSmartAccount: !!ecosystem.smartAccountOptions,
      sponsorGas: ecosystem.smartAccountOptions?.sponsorGas || false,
      defaultChainId: ecosystem.smartAccountOptions?.defaultChainId,
      accountFactoryType:
        ecosystem.smartAccountOptions?.accountFactoryAddress ===
        DEFAULT_ACCOUNT_FACTORY_V0_7
          ? "v0.7"
          : ecosystem.smartAccountOptions?.accountFactoryAddress ===
              DEFAULT_ACCOUNT_FACTORY_V0_6
            ? "v0.6"
            : "custom",
      customAccountFactoryAddress:
        ecosystem.smartAccountOptions?.accountFactoryAddress || "",
    },
    resolver: zodResolver(
      z
        .object({
          authOptions: z.array(z.string()),
          useCustomAuth: z.boolean(),
          customAuthEndpoint: z.string().optional(),
          customHeaders: z
            .array(
              z.object({
                key: z.string(),
                value: z.string(),
              }),
            )
            .optional(),
          useSmartAccount: z.boolean(),
          sponsorGas: z.boolean(),
          defaultChainId: z.coerce
            .number({
              invalid_type_error: "Please enter a valid chain ID",
            })
            .optional(),
          accountFactoryType: z.enum(["v0.6", "v0.7", "custom"]),
          customAccountFactoryAddress: z.string().optional(),
        })
        .refine(
          (data) => {
            if (
              data.useSmartAccount &&
              data.customAccountFactoryAddress &&
              !isAddress(data.customAccountFactoryAddress)
            ) {
              return false;
            }
            return true;
          },
          {
            message: "Please enter a valid custom account factory address",
            path: ["customAccountFactoryAddress"],
          },
        )
        .refine(
          (data) => {
            if (data.useSmartAccount && (data.defaultChainId ?? 0) <= 0) {
              return false;
            }
            return true;
          },
          {
            message: "Please enter a valid chain ID",
            path: ["defaultChainId"],
          },
        )
        .refine(
          (data) => {
            if (data.useCustomAuth && !data.customAuthEndpoint) {
              return false;
            }
            return true;
          },
          {
            message: "Please enter a valid custom auth endpoint",
            path: ["customAuthEndpoint"],
          },
        ),
    ),
  });
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "customHeaders",
  });

  const { mutateAsync: updateEcosystem, isPending } = useUpdateEcosystem(
    {
      authToken,
    },
    {
      onError: (error) => {
        const message =
          error instanceof Error ? error.message : "Failed to update ecosystem";
        toast.error(message);
      },
      onSuccess: () => {
        toast.success("Ecosystem options updated");
      },
    },
  );

  const onSubmit = (data: AuthOptionsFormData) => {
    let customAuthOptions: Ecosystem["customAuthOptions"] | null = null;
    if (data.useCustomAuth && data.customAuthEndpoint) {
      try {
        const url = new URL(data.customAuthEndpoint);
        invariant(url.hostname, "Invalid URL");
        customAuthOptions = {
          authEndpoint: {
            url: data.customAuthEndpoint,
            headers: data.customHeaders,
          },
        };
      } catch {
        toast.error("Invalid Custom Auth URL");
        return;
      }
    }

    let smartAccountOptions: Ecosystem["smartAccountOptions"] | null = null;
    if (data.useSmartAccount) {
      let accountFactoryAddress: string;
      switch (data.accountFactoryType) {
        case "v0.6":
          accountFactoryAddress = DEFAULT_ACCOUNT_FACTORY_V0_6;
          break;
        case "v0.7":
          accountFactoryAddress = DEFAULT_ACCOUNT_FACTORY_V0_7;
          break;
        case "custom":
          if (!data.customAccountFactoryAddress) {
            toast.error("Please enter a custom account factory address");
            return;
          }
          accountFactoryAddress = data.customAccountFactoryAddress;
          break;
      }

      smartAccountOptions = {
        defaultChainId: data.defaultChainId,
        sponsorGas: data.sponsorGas,
        accountFactoryAddress,
      };
    }

    updateEcosystem({
      ...ecosystem,
      authOptions: data.authOptions as (typeof authOptions)[number][],
      customAuthOptions,
      smartAccountOptions,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="flex flex-col gap-8"
      >
        <SettingsCard
          bottomText=""
          errorText=""
          noPermissionText=""
          header={{
            title: "Auth Options",
            description:
              "Configure the authentication options your ecosystem supports",
          }}
          saveButton={{
            onClick: form.handleSubmit(onSubmit),
            disabled: !form.formState.isValid,
            isPending: isPending,
          }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {authOptions.map((option) => (
              <FormField
                key={option}
                control={form.control}
                name="authOptions"
                render={({ field }) => {
                  const isChecked = field.value?.includes(option);
                  return (
                    <FormItem>
                      <FormLabel>
                        <div
                          className={cn(
                            "flex cursor-pointer flex-row items-center justify-center gap-3 rounded-lg border border-border p-3 hover:bg-accent",
                            isChecked && "bg-muted hover:bg-card",
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getSocialIcon(option)}
                            alt={option}
                            className="h-6 w-6"
                          />
                          <p className="text-center font-normal">
                            {option === "siwe"
                              ? "Wallet"
                              : option.slice(0, 1).toUpperCase() +
                                option.slice(1)}
                          </p>
                          <div className="flex-1" />
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </SettingsCard>

        <SettingsCard
          header={{
            title: "Custom Auth",
            description: "Authenticate with a custom endpoint",
          }}
          bottomText=""
          errorText=""
          noPermissionText=""
          saveButton={{
            onClick: form.handleSubmit(onSubmit),
            disabled: !form.formState.isValid,
            isPending: isPending,
          }}
        >
          <FormField
            control={form.control}
            name="useCustomAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="absolute top-6 right-6"
                    aria-label={
                      field.value
                        ? "Custom Auth Enabled"
                        : "Custom Auth Disabled"
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("useCustomAuth") && (
            <div className="mt-1 flex flex-col gap-4">
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
                      <div className="flex flex-col gap-3">
                        {fields.map((item, index) => (
                          <div key={item.id} className="flex gap-3">
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
                          variant="outline"
                          onClick={() => append({ key: "", value: "" })}
                          className="gap-2 self-start"
                        >
                          <PlusIcon className="size-4" />
                          Add Header
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          bottomText=""
          errorText=""
          noPermissionText=""
          header={{
            title: "Account Abstraction",
            description: "Enable smart accounts for your ecosystem",
          }}
          saveButton={{
            onClick: form.handleSubmit(onSubmit),
            disabled: !form.formState.isValid,
            isPending: isPending,
          }}
        >
          <FormField
            control={form.control}
            name="useSmartAccount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="absolute top-6 right-6"
                    aria-label={
                      field.value ? "Smart Accounts Enabled" : "Smart Accounts"
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch("useSmartAccount") && (
            <div className="mt-1 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="sponsorGas"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Sponsor Gas</FormLabel>
                      <FormDescription>
                        Enable gas sponsorship for smart accounts
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultChainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Chain ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1" />
                    </FormControl>
                    <FormDescription>
                      This will be the chain ID the smart account will be
                      initialized to on your{" "}
                      <a
                        href={`https://${ecosystem.slug}.ecosystem.thirdweb.com`}
                        className="text-link-foreground"
                        target="_blank"
                        rel="noreferrer"
                      >
                        ecosystem page
                      </a>
                      .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountFactoryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Factory</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account factory type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="v0.6">
                          Default Account Factory (v0.6)
                        </SelectItem>
                        <SelectItem value="v0.7">
                          Default Account Factory (v0.7)
                        </SelectItem>
                        <SelectItem value="custom">Custom factory</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose a default account factory or select custom to enter
                      your own address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("accountFactoryType") === "custom" && (
                <FormField
                  control={form.control}
                  name="customAccountFactoryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Account Factory Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0x..." />
                      </FormControl>
                      <FormDescription>
                        Enter your own smart account factory contract address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </SettingsCard>
      </form>
    </Form>
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
