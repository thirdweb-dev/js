"use client";

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
import { useMutation } from "@tanstack/react-query";
import type { ProjectBundlerService } from "@thirdweb-dev/service-utils";
import { Button } from "chakra/button";
import { FormErrorMessage, FormLabel } from "chakra/form";
import { Text } from "chakra/text";
import { TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isAddress, type ThirdwebClient } from "thirdweb";
import { z } from "zod";
import type { Project } from "@/api/projects";
import type { Team } from "@/api/team";
import { GatedSwitch } from "@/components/blocks/GatedSwitch";
import { MultiNetworkSelector } from "@/components/blocks/NetworkSelectors";
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
    <Flex flexDir="column" gap={8}>
      <Flex
        alignItems="left"
        flexDir={{ base: "column", lg: "row" }}
        gap={8}
        justifyContent="space-between"
      >
        <Flex flexDir="column" gap={2}>
          <Text>
            Configure the rules for your sponsored transactions.{" "}
            <UnderlineLink
              className="text-primary-500"
              href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules"
              rel="noopener noreferrer"
              target="_blank"
            >
              View documentation
            </UnderlineLink>
            .
          </Text>
        </Flex>
      </Flex>
      <Flex
        as="form"
        flexDir="column"
        gap={6}
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

          const parsedValues: Omit<ProjectBundlerService, "name" | "actions"> =
            {
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
                      placeholder="Enter an amount"
                      w="xs"
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
                  <UnderlineLink
                    className="text-primary-500"
                    href="https://portal.thirdweb.com/wallets/smart-wallet/infrastructure#supported-chains"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    supported chains.
                  </UnderlineLink>
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
                  client={props.client}
                  onChange={(chainIds) =>
                    form.setValue("allowedChainIds", chainIds)
                  }
                  selectedChainIds={form.watch("allowedChainIds") || []}
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
                <FormLabel
                  htmlFor="server-verifier-switch"
                  pointerEvents="none"
                >
                  Server verifier
                </FormLabel>
                <Text>
                  Specify your own endpoint that will verify each transaction
                  and decide whether it should be sponsored or not. <br /> This
                  gives you fine grained control and lets you build your own
                  rules.{" "}
                  <UnderlineLink
                    className="text-primary-500"
                    href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules#setting-up-a-server-verifier"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View server verifier documentation
                  </UnderlineLink>
                  .
                </Text>
              </div>

              <GatedSwitch
                currentPlan={props.validTeamPlan}
                requiredPlan="starter"
                switchProps={{
                  checked: form.watch("serverVerifier").enabled,
                  id: "server-verifier-switch",
                  onCheckedChange: (checked) => {
                    form.setValue(
                      "serverVerifier",
                      !checked
                        ? { enabled: false, headers: null, url: null }
                        : { enabled: true, headers: [], url: "" },
                    );
                  },
                }}
                teamSlug={props.teamSlug}
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
                        <Flex gap={2} key={customHeaderIdx} w="full">
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
            colorScheme="primary"
            isLoading={updateProject.isPending}
            type="submit"
          >
            Save changes
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
