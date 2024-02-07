import {
  Box,
  Divider,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  Heading,
  Text,
  FormLabel,
  Button,
  FormErrorMessage,
  TrackedLink,
} from "tw-components";
import {
  ApiKey,
  ApiKeyServicePolicy,
  ApiKeyServicePolicyLimits,
  usePolicies,
  useUpdatePolicies,
} from "@3rdweb-sdk/react/hooks/useApi";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTxNotifications } from "hooks/useTxNotifications";
import { NetworkDropdown } from "components/contract-components/contract-publish-form/NetworkDropdown";
import { LuTrash2 } from "react-icons/lu";
import { fromArrayToList, toArrFromList } from "utils/string";
import { validStrList } from "utils/validations";
import { isAddress } from "ethers/lib/utils";
import { useEffect } from "react";
import { GatedSwitch } from "components/settings/Account/Billing/GatedSwitch";

interface SponsorshipPoliciesProps {
  apiKey: ApiKey;
  trackingCategory: string;
}

const sponsorshipPoliciesValidationSchema = z.object({
  allowedChainIds: z.array(z.number()).nullable(),
  allowedContractAddresses: z
    .string()
    .refine((str) => validStrList(str, isAddress), {
      message: "Some of the addresses are invalid",
    })
    .nullable(),
  serverVerifier: z
    .object({
      url: z.string().refine((str) => str.startsWith("https://"), {
        message: "URL must start with https://",
      }),
      headers: z
        .array(z.object({ key: z.string(), value: z.string() }))
        .nullable(),
    })
    .nullable(),
  globalLimit: z
    .object({
      maxSpend: z.string().refine((n) => parseFloat(n) > 0, {
        message: "Must be a positive number",
      }),
      maxSpendUnit: z.enum(["usd", "native"]),
    })
    .nullable(),
});

export const SponsorshipPolicies: React.FC<SponsorshipPoliciesProps> = ({
  apiKey,
  trackingCategory,
}) => {
  const bundlerServiceId = apiKey.services?.find(
    (s) => s.name === "bundler",
  )?.id;
  const { data: policy } = usePolicies(bundlerServiceId);
  const { mutate: updatePolicy } = useUpdatePolicies();

  const form = useForm<z.infer<typeof sponsorshipPoliciesValidationSchema>>({
    resolver: zodResolver(sponsorshipPoliciesValidationSchema),
    defaultValues: {
      allowedChainIds:
        policy?.allowedChainIds && policy?.allowedChainIds?.length > 0
          ? policy?.allowedChainIds
          : null,
      allowedContractAddresses:
        policy?.allowedContractAddresses &&
        policy?.allowedContractAddresses?.length > 0
          ? fromArrayToList(policy?.allowedContractAddresses)
          : null,
      serverVerifier: policy?.serverVerifier ?? null,
      globalLimit: policy?.limits?.global ?? null,
    },
  });

  const customHeaderFields = useFieldArray({
    control: form.control,
    name: "serverVerifier.headers",
  });
  useEffect(() => {
    form.reset({
      allowedChainIds:
        policy?.allowedChainIds && policy?.allowedChainIds?.length > 0
          ? policy?.allowedChainIds
          : null,
      allowedContractAddresses:
        policy?.allowedContractAddresses &&
        policy?.allowedContractAddresses?.length > 0
          ? fromArrayToList(policy?.allowedContractAddresses)
          : null,
      serverVerifier: policy?.serverVerifier ?? null,
      globalLimit: policy?.limits?.global ?? null,
    });
  }, [policy, form]);

  const { onSuccess, onError } = useTxNotifications(
    "Sponsoship rules updated",
    "Failed to update sponsorship rules",
  );

  const handleSubmit = form.handleSubmit((values) => {
    if (!bundlerServiceId) {
      onError("No smart wallet service found for this API key");
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
      serverVerifier: values.serverVerifier,
      limits,
    };
    updatePolicy(
      {
        serviceId: bundlerServiceId,
        data: parsedValues,
      },
      {
        onSuccess,
        onError,
      },
    );
  });

  return (
    <Flex flexDir="column" gap={8}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        gap={8}
        justifyContent={"space-between"}
        alignItems={"left"}
      >
        <Flex flexDir={"column"} gap={2}>
          <Heading size="title.md" as="h1">
            Sponsorship rules
          </Heading>
          <Text>
            Configure the rules and rules for your sponsored transactions.{" "}
            <TrackedLink
              category={trackingCategory}
              href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules"
              color={"primary.500"}
            >
              View documentation
            </TrackedLink>
            .
          </Text>
        </Flex>
      </Flex>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        autoComplete="off"
      >
        <Flex flexDir="column" gap={6}>
          <FormControl>
            <Flex flexDir="column" gap={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Global spend limits
                  </FormLabel>
                  <Text>
                    Maximum gas cost (in USD) that you want to sponsor. This
                    applies for the duration of the billing period (monthly).
                    Once this limit is reached, your users will have to fund
                    their own gas costs.
                  </Text>
                </Box>

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
              </HStack>
              {form.watch("globalLimit") && (
                <VStack>
                  <FormControl
                    isInvalid={
                      !!form.getFieldState(
                        "globalLimit.maxSpend",
                        form.formState,
                      ).error
                    }
                  >
                    <FormLabel>Spend limit</FormLabel>
                    <HStack alignItems="center">
                      <Input
                        w={"xs"}
                        placeholder="Enter an amount"
                        {...form.register("globalLimit.maxSpend")}
                      />
                      <Select
                        w={"xs"}
                        {...form.register("globalLimit.maxSpendUnit")}
                      >
                        <option value={"usd"}>USD</option>
                        {/* TODO native currency <option value={"native"}>
                          Native Currency (ie. ETH)
                        </option> */}
                      </Select>
                      <Text>per month</Text>
                    </HStack>
                    <FormErrorMessage>
                      {
                        form.getFieldState(
                          "globalLimit.maxSpend",
                          form.formState,
                        ).error?.message
                      }
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
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
              <HStack justifyContent="space-between" alignItems="center">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Restrict to specific chains
                  </FormLabel>
                  <Text>
                    Only sponsor transactions on the specified chains. By
                    default, transactions can be sponsored on any of the{" "}
                    <TrackedLink
                      color="primary.500"
                      isExternal
                      category={trackingCategory}
                      href="https://portal.thirdweb.com/wallets/smart-wallet/infrastructure#supported-chains"
                    >
                      supported chains.{" "}
                    </TrackedLink>
                  </Text>
                </Box>

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
              </HStack>
              {form.watch("allowedChainIds") && (
                <Flex flexDir="column">
                  <NetworkDropdown
                    onMultiChange={(networksEnabled) =>
                      form.setValue("allowedChainIds", networksEnabled)
                    }
                    value={form.watch("allowedChainIds")}
                  />
                  <FormErrorMessage>
                    {
                      form.getFieldState("allowedChainIds", form.formState)
                        .error?.message
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
              <HStack justifyContent="space-between" alignItems="center">
                <Box>
                  <FormLabel pointerEvents={"none"}>
                    Restrict to specific contract addresses
                  </FormLabel>
                  <Text>
                    Only sponsor transactions for the specified contracts.
                  </Text>
                </Box>

                <Switch
                  colorScheme="primary"
                  isChecked={form.watch("allowedContractAddresses") !== null}
                  onChange={() => {
                    form.setValue(
                      "allowedContractAddresses",
                      form.watch("allowedContractAddresses") === null
                        ? ""
                        : null,
                    );
                  }}
                />
              </HStack>
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
              <HStack justifyContent="space-between" alignItems="center">
                <Box>
                  <FormLabel pointerEvents={"none"}>Server verifier</FormLabel>
                  <Text>
                    Specify your own endpoint that will verify each transaction
                    and decide wether it should be sponsored or not. This gives
                    you fine grained control and lets you build your own rules.{" "}
                    <TrackedLink
                      category={trackingCategory}
                      href="https://portal.thirdweb.com/wallets/smart-wallet/sponsorship-rules#setting-up-a-server-verifier"
                      color={"primary.500"}
                    >
                      View server verifier documentation
                    </TrackedLink>
                    .
                  </Text>
                </Box>

                <GatedSwitch
                  colorScheme="primary"
                  isChecked={!!form.watch("serverVerifier")}
                  onChange={() => {
                    form.setValue(
                      "serverVerifier",
                      !form.watch("serverVerifier")
                        ? {
                            url: "",
                            headers: [],
                          }
                        : null,
                    );
                  }}
                />
              </HStack>
              {form.watch("serverVerifier") && (
                <HStack alignItems={"start"}>
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
                    <Stack gap={3} alignItems={"end"}>
                      {customHeaderFields.fields.map((_, customHeaderIdx) => {
                        return (
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
                              icon={<LuTrash2 />}
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
                    </Stack>
                  </FormControl>
                </HStack>
              )}
            </Flex>
          </FormControl>
          <Divider />

          <Box alignSelf="flex-end">
            <Button type="submit" colorScheme="primary">
              Save changes
            </Button>
          </Box>
        </Flex>
      </form>
    </Flex>
  );
};
