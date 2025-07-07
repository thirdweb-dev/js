"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { isAddress } from "thirdweb";
import { getSocialIcon } from "thirdweb/wallets/in-app";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";
import invariant from "tiny-invariant";
import { z } from "zod";
import type { AuthOption, Ecosystem } from "@/api/ecosystems";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useUpdateEcosystem } from "../../hooks/use-update-ecosystem";

const authOptions = [
  "email",
  "phone",
  "passkey",
  "siwe",
  "guest",
  "google",
  "facebook",
  "x",
  "discord",
  "farcaster",
  "telegram",
  "github",
  "twitch",
  "steam",
  "apple",
  "coinbase",
  "line",
] as const satisfies AuthOption[];

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
  executionMode: "EIP4337" | "EIP7702";
};

export function AuthOptionsForm({
  ecosystem,
  authToken,
  teamId,
  client,
}: {
  ecosystem: Ecosystem;
  authToken: string;
  teamId: string;
  client: ThirdwebClient;
}) {
  const form = useForm<AuthOptionsFormData>({
    defaultValues: {
      accountFactoryType:
        ecosystem.smartAccountOptions?.accountFactoryAddress ===
        DEFAULT_ACCOUNT_FACTORY_V0_7
          ? "v0.7"
          : ecosystem.smartAccountOptions?.accountFactoryAddress ===
              DEFAULT_ACCOUNT_FACTORY_V0_6
            ? "v0.6"
            : "custom",
      authOptions: ecosystem.authOptions || [],
      customAccountFactoryAddress:
        ecosystem.smartAccountOptions?.accountFactoryAddress || "",
      customAuthEndpoint: ecosystem.customAuthOptions?.authEndpoint?.url || "",
      customHeaders: ecosystem.customAuthOptions?.authEndpoint?.headers || [],
      defaultChainId: ecosystem.smartAccountOptions?.defaultChainId,
      executionMode: ecosystem.smartAccountOptions?.executionMode || "EIP4337",
      sponsorGas: ecosystem.smartAccountOptions?.sponsorGas || false,
      useCustomAuth: !!ecosystem.customAuthOptions,
      useSmartAccount: !!ecosystem.smartAccountOptions,
    },
    resolver: zodResolver(
      z
        .object({
          accountFactoryType: z.enum(["v0.6", "v0.7", "custom"]),
          authOptions: z.array(z.string()),
          customAccountFactoryAddress: z.string().optional(),
          customAuthEndpoint: z.string().optional(),
          customHeaders: z
            .array(
              z.object({
                key: z.string(),
                value: z.string(),
              }),
            )
            .optional(),
          defaultChainId: z.coerce
            .number({
              invalid_type_error: "Please enter a valid chain ID",
            })
            .optional(),
          executionMode: z.enum(["EIP4337", "EIP7702"]),
          sponsorGas: z.boolean(),
          useCustomAuth: z.boolean(),
          useSmartAccount: z.boolean(),
        })
        .refine(
          (data) => {
            if (
              data.useSmartAccount &&
              data.executionMode === "EIP4337" &&
              data.accountFactoryType === "custom" &&
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
            if (
              data.useSmartAccount &&
              data.executionMode === "EIP4337" &&
              data.accountFactoryType === "custom" &&
              !data.customAccountFactoryAddress
            ) {
              return false;
            }
            return true;
          },
          {
            message: "Please enter a custom account factory address",
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
      teamId,
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
            headers: data.customHeaders,
            url: data.customAuthEndpoint,
          },
        };
      } catch {
        toast.error("Invalid Custom Auth URL");
        return;
      }
    }

    let smartAccountOptions: Ecosystem["smartAccountOptions"] | null = null;
    if (data.useSmartAccount) {
      let accountFactoryAddress: string | undefined;
      if (data.executionMode === "EIP4337") {
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
      }

      smartAccountOptions = {
        accountFactoryAddress,
        defaultChainId: data.defaultChainId,
        executionMode: data.executionMode,
        sponsorGas: data.sponsorGas,
      };
    }

    updateEcosystem({
      ...ecosystem,
      authOptions: data.authOptions as AuthOption[],
      customAuthOptions,
      smartAccountOptions,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error(errors);
        })}
      >
        <SettingsCard
          bottomText=""
          errorText=""
          header={{
            description:
              "Configure the authentication options your ecosystem supports",
            title: "Auth Options",
          }}
          noPermissionText=""
          saveButton={{
            disabled: !form.formState.isValid,
            isPending: isPending,
            onClick: form.handleSubmit(onSubmit),
          }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {authOptions.map((option) => (
              <FormField
                control={form.control}
                key={option}
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
                            alt={option}
                            className="h-6 w-6"
                            src={getSocialIcon(option)}
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
          bottomText=""
          errorText=""
          header={{
            description: "Authenticate with a custom endpoint",
            title: "Custom Auth",
          }}
          noPermissionText=""
          saveButton={{
            disabled: !form.formState.isValid,
            isPending: isPending,
            onClick: form.handleSubmit(onSubmit),
          }}
        >
          <FormField
            control={form.control}
            name="useCustomAuth"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormControl>
                  <Switch
                    aria-label={
                      field.value
                        ? "Custom Auth Enabled"
                        : "Custom Auth Disabled"
                    }
                    checked={field.value}
                    className="absolute top-6 right-6"
                    onCheckedChange={field.onChange}
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
                        placeholder="https://your-custom-auth-endpoint.com"
                        type="url"
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
                          <div className="flex gap-3" key={item.id}>
                            <Input
                              placeholder="Header Key"
                              {...form.register(`customHeaders.${index}.key`)}
                            />
                            <Input
                              placeholder="Header Value"
                              {...form.register(`customHeaders.${index}.value`)}
                            />
                            <Button
                              onClick={() => remove(index)}
                              type="button"
                              variant="destructive"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          className="gap-2 self-start"
                          onClick={() => append({ key: "", value: "" })}
                          type="button"
                          variant="outline"
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
          header={{
            description: "Enable smart accounts for your ecosystem",
            title: "Account Abstraction",
          }}
          noPermissionText=""
          saveButton={{
            disabled: !form.formState.isValid,
            isPending: isPending,
            onClick: form.handleSubmit(onSubmit),
          }}
        >
          <FormField
            control={form.control}
            name="useSmartAccount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <FormControl>
                  <Switch
                    aria-label={
                      field.value ? "Smart Accounts Enabled" : "Smart Accounts"
                    }
                    checked={field.value}
                    className="absolute top-6 right-6"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch("useSmartAccount") && (
            <div className="mt-1 flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                <FormField
                  control={form.control}
                  name="executionMode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Execution Mode</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select execution mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EIP4337">EIP-4337</SelectItem>
                          <SelectItem value="EIP7702">EIP-7702</SelectItem>
                        </SelectContent>
                      </Select>
                      {(() => {
                        const originalExecutionMode =
                          ecosystem.smartAccountOptions?.executionMode ||
                          "EIP4337";
                        const currentExecutionMode =
                          form.watch("executionMode");
                        const hasChanged =
                          currentExecutionMode !== originalExecutionMode;

                        return (
                          <FormDescription
                            className={hasChanged ? "text-warning-text" : ""}
                          >
                            {hasChanged
                              ? "Changing execution mode will change the final user addresses when they connect to your ecosystem."
                              : "Smart account standard (EIP-7702 is recommended)"}
                          </FormDescription>
                        );
                      })()}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sponsorGas"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 md:flex-1">
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
              </div>
              <FormField
                control={form.control}
                name="defaultChainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Chain ID</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        client={client}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be the chain ID the smart account will be
                      initialized to on your{" "}
                      <a
                        className="text-link-foreground"
                        href={`https://${ecosystem.slug}.ecosystem.thirdweb.com`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        ecosystem page
                      </a>
                      .
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("executionMode") === "EIP4337" && (
                <>
                  <FormField
                    control={form.control}
                    name="accountFactoryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Factory</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
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
                            <SelectItem value="custom">
                              Custom factory
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a default account factory or select custom to
                          enter your own address
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
                            Enter your own smart account factory contract
                            address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
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
        <Skeleton className="h-14 w-full md:w-32" key={option} />
      ))}
    </div>
  );
}
