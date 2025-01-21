"use client";

import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
import {
  type Account,
  type ApiKeyService,
  type ApiKeyServicePolicy,
  type ApiKeyServicePolicyLimits,
  usePolicies,
  useUpdatePolicies,
} from "@3rdweb-sdk/react/hooks/useApi";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  IconButton,
  Input,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isAddress } from "thirdweb/utils";
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Text,
  TrackedLink,
} from "tw-components";
import { joinWithComma, toArrFromList } from "utils/string";
import { validStrList } from "utils/validations";
import { z } from "zod";
import { GenericLoadingPage } from "../../../@/components/blocks/skeletons/GenericLoadingPage";

type AccountAbstractionSettingsPageProps = {
  apiKeyServices: ApiKeyService[];
  trackingCategory: string;
  twAccount: Account;
};

const aaSettingsFormSchema = z.object({
  allowedChainIds: z.array(z.number()).nullable(),
  allowedContractAddresses: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
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
  serverVerifier: z.object({
    url: z
      .string()
      .refine((str) => str.startsWith("https://"), {
        message: "URL must start with https://",
      })
      .nullable(),
    headers: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .nullable(),
    enabled: z.boolean(),
  }),
  globalLimit: z
    .object({
      maxSpend: z.string().refine((n) => Number.parseFloat(n) > 0, {
        message: "Must be a positive number",
      }),
      maxSpendUnit: z.enum(["usd", "native"]),
    })
    .nullable(),
  allowedOrBlockedWallets: z.string().nullable(),
});

export function AccountAbstractionSettingsPage(
  props: AccountAbstractionSettingsPageProps,
) {
  const { apiKeyServices, trackingCategory } = props;
  const bundlerServiceId = apiKeyServices?.find(
    (s) => s.name === "bundler",
  )?.id;
  const policiesQuery = usePolicies(bundlerServiceId);
  const { mutate: updatePolicy, isPending: updatingPolicy } =
    useUpdatePolicies();
  const trackEvent = useTrack();

  const policy = policiesQuery.data;

  const transformedQueryData = useMemo(
    () => ({
      allowedChainIds:
        policy?.allowedChainIds && policy?.allowedChainIds?.length > 0
          ? policy?.allowedChainIds
          : null,
      allowedContractAddresses:
        policy?.allowedContractAddresses &&
        policy?.allowedContractAddresses?.length > 0
          ? joinWithComma(policy?.allowedContractAddresses)
          : null,
      allowedWallets:
        policy?.allowedWallets && policy?.allowedWallets?.length > 0
          ? joinWithComma(policy?.allowedWallets)
          : null,
      blockedWallets:
        policy?.blockedWallets && policy?.blockedWallets?.length > 0
          ? joinWithComma(policy?.blockedWallets)
          : null,
      bypassWallets:
        policy?.bypassWallets && policy?.bypassWallets?.length > 0
          ? joinWithComma(policy?.bypassWallets)
          : null,
      serverVerifier: policy?.serverVerifier?.url
        ? { ...policy.serverVerifier, enabled: true }
        : { enabled: false, url: null, headers: null },
      globalLimit: policy?.limits?.global ?? null,
      allowedOrBlockedWallets:
        policy?.allowedWallets && policy?.allowedWallets?.length > 0
          ? "allowed"
          : policy?.blockedWallets && policy?.blockedWallets?.length > 0
            ? "blocked"
            : null,
    }),
    [policy],
  );

  const form = useForm<z.infer<typeof aaSettingsFormSchema>>({
    resolver: zodResolver(aaSettingsFormSchema),
    defaultValues: transformedQueryData,
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

  if (policiesQuery.isPending) {
    return <GenericLoadingPage />;
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        gap={8}
        justifyContent="space-between"
        alignItems="left"
      >
        <Flex flexDir="column" gap={2}>
          <Text>
            Configure the rules for your sponsored transactions.{" "}
            <TrackedLink
              category={trackingCategory}
              href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules"
              color="primary.500"
            >
              View documentation
            </TrackedLink>
            .
          </Text>
        </Flex>
      </Flex>
      <Flex
        flexDir="column"
        gap={6}
        as="form"
        onSubmit={form.handleSubmit((values) => {
          if (!bundlerServiceId) {
            onError("No account abstraction service found for this API key");
            return;
          }
          const limits: ApiKeyServicePolicyLimits | null = values.globalLimit
            ? {
                global: {
                  maxSpend: values.globalLimit.maxSpend,
                  maxSpendUnit: values.globalLimit.maxSpendUnit,
                },
              }
            : null;
          const parsedValues: ApiKeyServicePolicy = {
            allowedContractAddresses:
              values.allowedContractAddresses !== null
                ? toArrFromList(values.allowedContractAddresses)
                : null,
            allowedChainIds: values.allowedChainIds,
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
            serverVerifier:
              values.serverVerifier &&
              typeof values.serverVerifier.url === "string" &&
              values.serverVerifier.enabled
                ? {
                    headers: values.serverVerifier.headers ?? [],
                    url: values.serverVerifier.url,
                  }
                : null,
            limits,
          };
          trackEvent({
            category: trackingCategory,
            action: "update-sponsorship-rules",
            label: "attempt",
          });
          updatePolicy(
            {
              serviceId: bundlerServiceId,
              data: parsedValues,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: trackingCategory,
                  action: "update-sponsorship-rules",
                  label: "success",
                });
                onSuccess();
              },
              onError: (error) => {
                onError(error);
                trackEvent({
                  category: trackingCategory,
                  action: "update-sponsorship-rules",
                  label: "error",
                  error,
                });
              },
            },
          );
        })}
      >
        <FormControl>
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">Global spend limits</FormLabel>
                <Text>
                  Maximum gas cost (in USD) that you want to sponsor. <br />{" "}
                  This applies for the duration of the billing period (monthly).
                  Once this limit is reached, your users will have to fund their
                  own gas costs.
                </Text>
              </div>

              <Switch
                colorScheme="primary"
                isChecked={!!form.watch("globalLimit")}
                onChange={() => {
                  form.setValue(
                    "globalLimit",
                    !form.watch("globalLimit")
                      ? {
                          maxSpend: "0",
                          maxSpendUnit: "usd",
                        }
                      : null,
                  );
                }}
              />
            </div>
            {form.watch("globalLimit") && (
              <div className="flex flex-col">
                <FormControl
                  isInvalid={
                    !!form.getFieldState("globalLimit.maxSpend", form.formState)
                      .error
                  }
                >
                  <FormLabel>Spend limit</FormLabel>
                  <div className="flex flex-row items-center gap-2">
                    <Input
                      w="xs"
                      placeholder="Enter an amount"
                      {...form.register("globalLimit.maxSpend")}
                    />
                    <Select
                      w="xs"
                      {...form.register("globalLimit.maxSpendUnit")}
                    >
                      <option value="usd">USD</option>
                      {/* TODO native currency <option value={"native"}>
                          Native Currency (ie. ETH)
                        </option> */}
                    </Select>
                    <Text>per month</Text>
                  </div>
                  <FormErrorMessage>
                    {
                      form.getFieldState("globalLimit.maxSpend", form.formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
              </div>
            )}
          </Flex>
        </FormControl>
        <Divider />
        <FormControl
          isInvalid={
            !!form.getFieldState("allowedChainIds", form.formState).error
          }
        >
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">
                  Restrict to specific chains
                </FormLabel>
                <Text>
                  Only sponsor transactions on the specified chains. <br /> By
                  default, transactions can be sponsored on any of the{" "}
                  <TrackedLink
                    color="primary.500"
                    isExternal
                    category={trackingCategory}
                    href="https://portal.thirdweb.com/wallets/smart-wallet/infrastructure#supported-chains"
                  >
                    supported chains.
                  </TrackedLink>
                </Text>
              </div>

              <Switch
                colorScheme="primary"
                isChecked={form.watch("allowedChainIds") !== null}
                onChange={() => {
                  form.setValue(
                    "allowedChainIds",
                    !form.watch("allowedChainIds") ? [] : null,
                  );
                }}
              />
            </div>
            {form.watch("allowedChainIds") && (
              <Flex flexDir="column">
                <MultiNetworkSelector
                  selectedChainIds={form.watch("allowedChainIds") || []}
                  onChange={(chainIds) =>
                    form.setValue("allowedChainIds", chainIds)
                  }
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("allowedChainIds", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </Flex>
            )}
          </Flex>
        </FormControl>
        <Divider />
        <FormControl
          isInvalid={
            !!form.getFieldState("allowedContractAddresses", form.formState)
              .error
          }
        >
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">
                  Restrict to specific contract addresses
                </FormLabel>
                <Text>
                  Only sponsor transactions for the specified contracts.
                </Text>
              </div>

              <Switch
                colorScheme="primary"
                isChecked={form.watch("allowedContractAddresses") !== null}
                onChange={() => {
                  form.setValue(
                    "allowedContractAddresses",
                    form.watch("allowedContractAddresses") === null ? "" : null,
                  );
                }}
              />
            </div>
            {form.watch("allowedContractAddresses") !== null && (
              <Flex flexDir="column">
                <Textarea
                  placeholder="Comma separated list of contract addresses. ex: 0x1234..., 0x5678..."
                  {...form.register("allowedContractAddresses")}
                />
                <FormErrorMessage>
                  {
                    form.getFieldState(
                      "allowedContractAddresses",
                      form.formState,
                    ).error?.message
                  }
                </FormErrorMessage>
              </Flex>
            )}
          </Flex>
        </FormControl>

        <Divider />
        <FormControl>
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">
                  Allowlisted/Blocklisted accounts
                </FormLabel>
                <Text>
                  Select either allowlisted or blocklisted accounts. Disabling
                  this option will allow all accounts.
                </Text>
              </div>

              <Switch
                colorScheme="primary"
                isChecked={form.watch("allowedOrBlockedWallets") !== null}
                onChange={() => {
                  form.setValue(
                    "allowedOrBlockedWallets",
                    form.watch("allowedOrBlockedWallets") === null ? "" : null,
                  );
                }}
              />
            </div>
            {form.watch("allowedOrBlockedWallets") !== null && (
              <Select
                placeholder="Select allowed or blocked wallets"
                {...form.register("allowedOrBlockedWallets")}
              >
                <option value="allowed">Allowlisted wallets</option>
                <option value="blocked">Blocklisted wallets</option>
              </Select>
            )}

            {form.watch("allowedOrBlockedWallets") === "allowed" && (
              <Flex flexDir="column" gap={2}>
                <Text>
                  Only transactions from these accounts will be sponsored. The
                  same address will be considered across all networks by
                  default.
                </Text>
                <Textarea
                  placeholder="Comma separated list of wallet addresses. ex: 0x1234..., 0x5678..."
                  {...form.register("allowedWallets")}
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("allowedWallets", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </Flex>
            )}

            {form.watch("allowedOrBlockedWallets") === "blocked" && (
              <Flex flexDir="column" gap={2}>
                <Text>
                  Transactions from these accounts will not be sponsored. The
                  same address will be considered across all networks by
                  default.
                </Text>
                <Textarea
                  placeholder="Comma separated list of wallet addresses. ex: 0x1234..., 0x5678..."
                  {...form.register("blockedWallets")}
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("blockedWallets", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </Flex>
            )}
          </Flex>
        </FormControl>

        <Divider />
        <FormControl>
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">Server verifier</FormLabel>
                <Text>
                  Specify your own endpoint that will verify each transaction
                  and decide whether it should be sponsored or not. <br /> This
                  gives you fine grained control and lets you build your own
                  rules.{" "}
                  <TrackedLink
                    category={trackingCategory}
                    href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules#setting-up-a-server-verifier"
                    color="primary.500"
                  >
                    View server verifier documentation
                  </TrackedLink>
                  .
                </Text>
              </div>

              <GatedSwitch
                upgradeRequired={!props.twAccount.advancedEnabled}
                checked={
                  form.watch("serverVerifier").enabled &&
                  props.twAccount.advancedEnabled
                }
                onCheckedChange={(checked) => {
                  form.setValue(
                    "serverVerifier",
                    !checked
                      ? { enabled: false, url: null, headers: null }
                      : { enabled: true, url: "", headers: [] },
                  );
                }}
              />
            </div>
            {form.watch("serverVerifier").enabled && (
              <div className="flex flex-row items-start">
                <FormControl
                  isInvalid={
                    !!form.getFieldState("serverVerifier.url", form.formState)
                      .error
                  }
                >
                  <FormLabel>URL</FormLabel>
                  <Input
                    placeholder="https://example.com/your-verifier"
                    type="text"
                    {...form.register("serverVerifier.url")}
                  />
                  <FormErrorMessage>
                    {
                      form.getFieldState("serverVerifier.url", form.formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel size="label.sm">Custom Headers</FormLabel>
                  <div className="flex flex-col items-end gap-3">
                    {customHeaderFields.fields.map((_, customHeaderIdx) => {
                      return (
                        // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                        <Flex key={customHeaderIdx} gap={2} w="full">
                          <Input
                            placeholder="Key"
                            type="text"
                            {...form.register(
                              `serverVerifier.headers.${customHeaderIdx}.key`,
                            )}
                          />
                          <Input
                            placeholder="Value"
                            type="text"
                            {...form.register(
                              `serverVerifier.headers.${customHeaderIdx}.value`,
                            )}
                          />
                          <IconButton
                            aria-label="Remove header"
                            icon={<TrashIcon />}
                            onClick={() => {
                              customHeaderFields.remove(customHeaderIdx);
                            }}
                          />
                        </Flex>
                      );
                    })}
                    <Button
                      onClick={() => {
                        customHeaderFields.append({
                          key: "",
                          value: "",
                        });
                      }}
                      w={
                        customHeaderFields.fields.length === 0
                          ? "full"
                          : "fit-content"
                      }
                    >
                      Add header
                    </Button>
                  </div>
                </FormControl>
              </div>
            )}
          </Flex>
        </FormControl>

        <Divider />
        <FormControl
          isInvalid={
            !!form.getFieldState("bypassWallets", form.formState).error
          }
        >
          <Flex flexDir="column" gap={4}>
            <div className="flex flex-row items-center justify-between gap-6 lg:gap-12">
              <div>
                <FormLabel pointerEvents="none">Admin accounts</FormLabel>
                <Text>
                  These accounts won&apos;t be subject to any sponsorship rules.
                  All transactions will be sponsored.
                </Text>
              </div>

              <Switch
                colorScheme="primary"
                isChecked={form.watch("bypassWallets") !== null}
                onChange={() => {
                  form.setValue(
                    "bypassWallets",
                    form.watch("bypassWallets") === null ? "" : null,
                  );
                }}
              />
            </div>
            {form.watch("bypassWallets") !== null && (
              <Flex flexDir="column">
                <Textarea
                  placeholder="Comma separated list of admin accounts. ex: 0x1234..., 0x5678..."
                  {...form.register("bypassWallets")}
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("bypassWallets", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </Flex>
            )}
          </Flex>
        </FormControl>

        <Divider />

        <Box alignSelf="flex-end">
          <Button
            type="submit"
            colorScheme="primary"
            isLoading={updatingPolicy}
          >
            Save changes
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
