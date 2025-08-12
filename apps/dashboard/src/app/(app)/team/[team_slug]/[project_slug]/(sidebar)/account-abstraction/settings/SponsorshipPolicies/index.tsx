"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ProjectBundlerService } from "@thirdweb-dev/service-utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isAddress, type ThirdwebClient } from "thirdweb";
import { z } from "zod";
import type { Project } from "@/api/project/projects";
import type { Team } from "@/api/team/get-team";
import { GatedSwitch } from "@/components/blocks/GatedSwitch";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { updateProjectClient } from "@/hooks/useApi";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { joinWithComma, toArrFromList } from "@/utils/string";
import { validStrList } from "@/utils/validations";

type AccountAbstractionSettingsPageProps = {
  bundlerService: ProjectBundlerService;
  project: Project;
  teamId: string;
  teamSlug: string;
  validTeamPlan: Team["billingPlan"];
  client: ThirdwebClient;
};

const aaSettingsFormSchema = z.object({
  allowedChainIds: z.array(z.number()).nullable(),
  allowedContractAddresses: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
  allowedOrBlockedWallets: z.string().nullable(),
  allowedWallets: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
  blockedWallets: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
  bypassWallets: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
  globalLimit: z
    .object({
      maxSpend: z.string().refine((n) => Number.parseFloat(n) > 0, {
        message: "Must be a positive number",
      }),
      maxSpendUnit: z.enum(["usd", "native"]),
    })
    .nullable(),
  serverVerifier: z.object({
    enabled: z.boolean(),
    headers: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .nullable(),
    url: z
      .string()
      .refine((str) => str.startsWith("https://"), {
        message: "URL must start with https://",
      })
      .nullable(),
  }),
});

export function AccountAbstractionSettingsPage(
  props: AccountAbstractionSettingsPageProps,
) {
  const updateProject = useMutation({
    mutationFn: async (projectValues: Partial<Project>) => {
      await updateProjectClient(
        {
          projectId: props.project.id,
          teamId: props.teamId,
        },
        projectValues,
      );
    },
  });

  const policy = props.bundlerService;

  const transformedQueryData = useMemo(() => {
    const allowedContractAddresses = policy.allowedContractAddresses?.filter(
      (x) => x !== "",
    );

    const allowedWallets = policy.allowedWallets?.filter((x) => x !== "");
    const blockedWallets = policy.blockedWallets?.filter((x) => x !== "");

    // there is a bug in API server that makes `allowedChainIds` an array with `0` if we set it to null
    const allowedChainIds = policy.allowedChainIds?.filter((x) => x !== 0);

    return {
      allowedChainIds:
        allowedChainIds && allowedChainIds?.length > 0 ? allowedChainIds : null,
      allowedContractAddresses:
        allowedContractAddresses && allowedContractAddresses.length > 0
          ? joinWithComma(allowedContractAddresses)
          : null,
      allowedOrBlockedWallets:
        allowedWallets && allowedWallets?.length > 0
          ? "allowed"
          : blockedWallets && blockedWallets?.length > 0
            ? "blocked"
            : null,
      allowedWallets:
        allowedWallets && allowedWallets?.length > 0
          ? joinWithComma(allowedWallets)
          : null,
      blockedWallets:
        blockedWallets && blockedWallets?.length > 0
          ? joinWithComma(blockedWallets)
          : null,
      bypassWallets:
        policy.bypassWallets && policy.bypassWallets?.length > 0
          ? joinWithComma(policy.bypassWallets)
          : null,
      globalLimit: policy.limits?.global ?? null,
      serverVerifier: policy.serverVerifier?.url
        ? {
            enabled: true,
            headers: policy.serverVerifier.headers || null,
            url: policy.serverVerifier.url,
          }
        : {
            enabled: false,
            headers: null,
            url: null,
          },
    };
  }, [policy]);

  const form = useForm<z.infer<typeof aaSettingsFormSchema>>({
    defaultValues: transformedQueryData,
    resolver: zodResolver(aaSettingsFormSchema),
    values: transformedQueryData,
  });

  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "serverVerifier.headers",
  });

  const { onSuccess, onError } = useTxNotifications(
    "Sponsorship rules updated",
    "Failed to update sponsorship rules",
  );

  return (
    <div className="">
      <Form {...form}>
        <form
          className="bg-card border rounded-lg"
          onSubmit={form.handleSubmit((values) => {
            const limits: ProjectBundlerService["limits"] | null =
              values.globalLimit
                ? {
                    global: {
                      maxSpend: values.globalLimit.maxSpend,
                      maxSpendUnit: values.globalLimit.maxSpendUnit,
                    },
                  }
                : null;

            const parsedValues: Omit<
              ProjectBundlerService,
              "name" | "actions"
            > = {
              // don't set null - `updateProject` API adds chainId 0 to the list if its null and makes it `[0]`
              allowedChainIds: values.allowedChainIds || [],
              allowedContractAddresses: values.allowedContractAddresses
                ? toArrFromList(values.allowedContractAddresses)
                : null,
              allowedWallets:
                values.allowedOrBlockedWallets === "allowed" &&
                values.allowedWallets !== null
                  ? toArrFromList(values.allowedWallets)
                  : null,
              blockedWallets:
                values.allowedOrBlockedWallets === "blocked" &&
                values.blockedWallets !== null
                  ? toArrFromList(values.blockedWallets)
                  : null,
              bypassWallets:
                values.bypassWallets !== null
                  ? toArrFromList(values.bypassWallets)
                  : null,
              limits,
              serverVerifier:
                values.serverVerifier &&
                typeof values.serverVerifier.url === "string" &&
                values.serverVerifier.enabled
                  ? {
                      headers: values.serverVerifier.headers ?? [],
                      url: values.serverVerifier.url,
                    }
                  : null,
            };

            const newServices = props.project.services.map((service) => {
              if (service.name === "bundler") {
                const bundlerService: ProjectBundlerService = {
                  ...service,
                  actions: [],
                  ...parsedValues,
                };

                return bundlerService;
              }

              return service;
            });

            updateProject.mutate(
              {
                services: newServices,
              },
              {
                onError,
                onSuccess,
              },
            );
          })}
        >
          <div className="p-4 lg:p-6 border-b border-dashed">
            <h2 className="text-xl font-semibold tracking-tight mb-0.5">
              Sponsorship policies
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure the rules for your sponsored transactions.{" "}
              <UnderlineLink
                className="text-primary-500"
                href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules"
                rel="noopener noreferrer"
                target="_blank"
              >
                View documentation
              </UnderlineLink>
            </p>
          </div>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="globalLimit"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6 border-b border-dashed border-border">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        Global spend limits
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Maximum gas cost (in USD) that you want to sponsor.{" "}
                        <br /> This applies for the duration of the billing
                        period (monthly). Once this limit is reached, your users
                        will have to fund their own gas costs.
                      </p>
                    </div>

                    <Switch
                      checked={!!field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked
                            ? {
                                maxSpend: "0",
                                maxSpendUnit: "usd",
                              }
                            : null,
                        );
                      }}
                    />
                  </div>

                  {field.value && (
                    <FormField
                      control={form.control}
                      name="globalLimit.maxSpend"
                      render={({ field: spendField }) => (
                        <FormItem>
                          <FormLabel>Spend limit</FormLabel>
                          <div className="flex flex-row items-center gap-3">
                            <Input
                              placeholder="Enter an amount"
                              className="w-36"
                              {...spendField}
                            />

                            <FormField
                              control={form.control}
                              name="globalLimit.maxSpendUnit"
                              render={({ field: unitField }) => (
                                <Select
                                  onValueChange={unitField.onChange}
                                  value={unitField.value}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="usd">USD</SelectItem>
                                    {/* TODO native currency <SelectItem value="native">
                                        Native Currency (ie. ETH)
                                      </SelectItem> */}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <p className="text-sm text-muted-foreground">
                              per month
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="allowedChainIds"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6 border-b border-dashed border-border">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        Restrict to specific chains
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Only sponsor transactions on the specified chains.{" "}
                        <br /> By default, transactions can be sponsored on any
                        of the{" "}
                        <UnderlineLink
                          className="text-primary-500"
                          href="https://portal.thirdweb.com/wallets/smart-wallet/infrastructure#supported-chains"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          supported chains.
                        </UnderlineLink>
                      </p>
                    </div>

                    <Switch
                      checked={field.value !== null}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? [] : null);
                      }}
                    />
                  </div>
                  {field.value && (
                    <div className="flex flex-col gap-4">
                      <MultiNetworkSelector
                        className="max-w-xl bg-background"
                        client={props.client}
                        onChange={(chainIds) => field.onChange(chainIds)}
                        selectedChainIds={field.value || []}
                      />
                      <FormMessage />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="allowedContractAddresses"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6 border-b border-dashed border-border">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        Restrict to specific contract addresses
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Only sponsor transactions for the specified contracts.
                      </p>
                    </div>

                    <Switch
                      checked={field.value !== null}
                      onCheckedChange={(v) => {
                        field.onChange(v ? "" : null);
                      }}
                    />
                  </div>
                  {field.value !== null && (
                    <div className="flex flex-col gap-4">
                      <Textarea
                        placeholder="Comma separated list of contract addresses. ex: 0x1234..., 0x5678..."
                        {...field}
                        value={field.value ?? ""}
                      />
                      <FormMessage />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="allowedOrBlockedWallets"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6 border-b border-dashed border-border">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        Allowlisted/Blocklisted accounts
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Select either allowlisted or blocklisted accounts.
                        Disabling this option will allow all accounts.
                      </p>
                    </div>

                    <Switch
                      checked={field.value !== null}
                      onCheckedChange={(v) => {
                        field.onChange(v ? "" : null);
                      }}
                    />
                  </div>
                  {field.value !== null && (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select allowed or blocked wallets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allowed">
                          Allowlisted wallets
                        </SelectItem>
                        <SelectItem value="blocked">
                          Blocklisted wallets
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {field.value === "allowed" && (
                    <FormField
                      control={form.control}
                      name="allowedWallets"
                      render={({ field: walletsField }) => (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">
                            Only transactions from these accounts will be
                            sponsored. The same address will be considered
                            across all networks by default.
                          </p>
                          <Textarea
                            spellCheck={false}
                            placeholder="Comma separated list of wallet addresses. ex: 0x1234..., 0x5678..."
                            {...walletsField}
                            value={walletsField.value ?? ""}
                          />
                          <FormMessage />
                        </div>
                      )}
                    />
                  )}

                  {field.value === "blocked" && (
                    <FormField
                      control={form.control}
                      name="blockedWallets"
                      render={({ field: walletsField }) => (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-muted-foreground">
                            Transactions from these accounts will not be
                            sponsored. The same address will be considered
                            across all networks by default.
                          </p>
                          <Textarea
                            spellCheck={false}
                            placeholder="Comma separated list of wallet addresses. ex: 0x1234..., 0x5678..."
                            {...walletsField}
                            value={walletsField.value ?? ""}
                          />
                          <FormMessage />
                        </div>
                      )}
                    />
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="serverVerifier"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6 border-b border-dashed border-border">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel
                        htmlFor="server-verifier-switch"
                        className="text-base font-medium"
                      >
                        Server verifier
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Specify your own endpoint that will verify each
                        transaction and decide whether it should be sponsored or
                        not. <br /> This gives you fine grained control and lets
                        you build your own rules.{" "}
                        <UnderlineLink
                          className="text-primary-500"
                          href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules#setting-up-a-server-verifier"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View server verifier documentation
                        </UnderlineLink>
                        .
                      </p>
                    </div>

                    <GatedSwitch
                      currentPlan={props.validTeamPlan}
                      requiredPlan="starter"
                      switchProps={{
                        checked: field.value.enabled,
                        id: "server-verifier-switch",
                        onCheckedChange: (v) => {
                          field.onChange(
                            !v
                              ? { enabled: false, headers: null, url: null }
                              : { enabled: true, headers: [], url: "" },
                          );
                        },
                      }}
                      teamSlug={props.teamSlug}
                    />
                  </div>
                  {field.value.enabled && (
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="serverVerifier.url"
                        render={({ field: urlField }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <Input
                              placeholder="https://example.com/your-verifier"
                              type="text"
                              {...urlField}
                              value={urlField.value ?? ""}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serverVerifier.headers"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm">
                              Custom Headers
                            </FormLabel>
                            <div className="space-y-3">
                              {customHeaderFields.fields.map((_, headerIdx) => (
                                <div
                                  // biome-ignore lint/suspicious/noArrayIndexKey: fine
                                  key={headerIdx}
                                  className="flex items-center gap-3 w-full"
                                >
                                  <Input
                                    placeholder="Key"
                                    className="max-w-xs"
                                    type="text"
                                    {...form.register(
                                      `serverVerifier.headers.${headerIdx}.key`,
                                    )}
                                  />
                                  <Input
                                    placeholder="Value"
                                    className="max-w-sm"
                                    type="text"
                                    {...form.register(
                                      `serverVerifier.headers.${headerIdx}.value`,
                                    )}
                                  />
                                  <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                      customHeaderFields.remove(headerIdx)
                                    }
                                    className="size-10 rounded-full p-0 shrink-0"
                                  >
                                    <TrashIcon className="size-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  customHeaderFields.append({
                                    key: "",
                                    value: "",
                                  });
                                }}
                                className="w-fit bg-background rounded-full gap-2"
                              >
                                <PlusIcon className="size-3.5" />
                                Add header
                              </Button>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <DynamicHeight>
            <FormField
              control={form.control}
              name="bypassWallets"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4 p-4 lg:p-6">
                  <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-medium">
                        Admin accounts
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        These accounts won&apos;t be subject to any sponsorship
                        rules. All transactions will be sponsored.
                      </p>
                    </div>

                    <Switch
                      checked={field.value !== null}
                      onCheckedChange={(v) => {
                        field.onChange(v ? "" : null);
                      }}
                    />
                  </div>
                  {field.value !== null && (
                    <div className="flex flex-col gap-4">
                      <Textarea
                        placeholder="Comma separated list of admin accounts. ex: 0x1234..., 0x5678..."
                        {...field}
                        value={field.value ?? ""}
                      />
                      <FormMessage />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </DynamicHeight>

          <div className="flex justify-end border-t px-4 lg:px-6 py-4">
            <Button
              size="sm"
              disabled={updateProject.isPending}
              type="submit"
              className="gap-2"
            >
              {updateProject.isPending && <Spinner className="size-4" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
