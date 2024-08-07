import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlatformFees, useUpdatePlatformFees } from "@thirdweb-dev/react";
import {
  CommonPlatformFeeSchema,
  type ValidContractInstance,
} from "@thirdweb-dev/sdk";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import type { z } from "zod";
import { SettingDetectedState } from "./detected-state";

export const SettingsPlatformFees = <
  TContract extends ValidContractInstance | undefined,
>({
  contract,
  detectedState,
}: {
  contract: TContract;
  detectedState: ExtensionDetectedState;
}) => {
  const trackEvent = useTrack();
  const query = usePlatformFees(contract);
  const address = useActiveAccount()?.address;
  const mutation = useUpdatePlatformFees(contract);
  const form = useForm<z.input<typeof CommonPlatformFeeSchema>>({
    resolver: zodResolver(CommonPlatformFeeSchema),
    defaultValues: query.data,
    values: query.data,
  });

  const chain = useV5DashboardChain(contract?.chainId);
  const contractV5 =
    contract && chain
      ? getContract({
          address: contract.getAddress(),
          chain: chain,
          client: thirdwebClient,
        })
      : null;

  const { onSuccess, onError } = useTxNotifications(
    "Platform fee settings updated",
    "Error updating platform fee settings",
    contractV5,
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="platformFee" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={form.handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-platform-fees",
            label: "attempt",
          });
          // if we switch back to mutateAsync then *need* to catch errors
          mutation.mutate(d, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "settings",
                action: "set-platform-fees",
                label: "success",
              });
              form.reset(variables);
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "settings",
                action: "set-platform-fees",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
        direction="column"
      >
        <Flex p={{ base: 6, md: 10 }} as="section" direction="column" gap={4}>
          <Heading size="title.sm">Platform fee</Heading>
          <Text size="body.md" fontStyle="italic">
            The wallet address that should receive the revenue from platform
            fees.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isInvalid={
                !!form.getFieldState("platform_fee_recipient", form.formState)
                  .error
              }
              isDisabled={!address}
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                solidityType="address"
                formContext={form}
                variant="filled"
                {...form.register("platform_fee_recipient")}
                isDisabled={!address}
              />
              <FormErrorMessage>
                {
                  form.getFieldState("platform_fee_recipient", form.formState)
                    .error?.message
                }
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isDisabled={!address}
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!form.getFieldState(
                  "platform_fee_basis_points",
                  form.formState,
                ).error
              }
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                variant="filled"
                value={form.watch("platform_fee_basis_points")}
                onChange={(value) =>
                  form.setValue("platform_fee_basis_points", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <FormErrorMessage>
                {
                  form.getFieldState(
                    "platform_fee_basis_points",
                    form.formState,
                  ).error?.message
                }
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
        {contractV5 && (
          <AdminOnly contract={contractV5}>
            <TransactionButton
              colorScheme="primary"
              transactionCount={1}
              isDisabled={query.isLoading || !form.formState.isDirty}
              type="submit"
              isLoading={mutation.isLoading}
              loadingText="Saving..."
              size="md"
              borderRadius="xl"
              borderTopLeftRadius="0"
              borderTopRightRadius="0"
            >
              Update Platform Fee Settings
            </TransactionButton>
          </AdminOnly>
        )}
      </Flex>
    </Card>
  );
};
