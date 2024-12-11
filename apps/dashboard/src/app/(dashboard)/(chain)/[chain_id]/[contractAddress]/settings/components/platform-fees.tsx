"use client";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { AddressOrEnsSchema, BasisPointsSchema } from "constants/schemas";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import {
  getPlatformFeeInfo,
  setPlatformFeeInfo,
} from "thirdweb/extensions/common";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import z from "zod";
import { SettingDetectedState } from "./detected-state";

// @internal
const CommonPlatformFeeSchema = z.object({
  /**
   * platform fee basis points
   */
  platform_fee_basis_points: BasisPointsSchema,
  /**
   * platform fee recipient address
   */
  platform_fee_recipient: AddressOrEnsSchema,
});

export const SettingsPlatformFees = ({
  contract,
  detectedState,
  twAccount,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  twAccount: Account | undefined;
}) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const platformFeesQuery = useReadContract(getPlatformFeeInfo, { contract });
  const platformFeeInfo = platformFeesQuery.data
    ? {
        platform_fee_recipient: platformFeesQuery.data[0],
        platform_fee_basis_points: platformFeesQuery.data[1],
      }
    : undefined;

  const form = useForm<z.input<typeof CommonPlatformFeeSchema>>({
    resolver: zodResolver(CommonPlatformFeeSchema),
    defaultValues: platformFeeInfo,
    values: platformFeeInfo,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Platform fee settings updated",
    "Error updating platform fee settings",
    contract,
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="platformFee" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={form.handleSubmit((data) => {
          trackEvent({
            category: "settings",
            action: "set-platform-fees",
            label: "attempt",
          });
          const transaction = setPlatformFeeInfo({
            contract,
            platformFeeRecipient: data.platform_fee_recipient,
            platformFeeBps: BigInt(data.platform_fee_basis_points),
          });
          sendAndConfirmTx.mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "settings",
                action: "set-platform-fees",
                label: "success",
              });
              form.reset(data);
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
                isDisabled={!address || sendAndConfirmTx.isPending}
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
                isDisabled={sendAndConfirmTx.isPending}
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
        <AdminOnly contract={contract}>
          <TransactionButton
            twAccount={twAccount}
            txChainID={contract.chain.id}
            transactionCount={1}
            disabled={platformFeesQuery.isPending || !form.formState.isDirty}
            type="submit"
            isPending={sendAndConfirmTx.isPending}
            className="!rounded-t-none rounded-xl"
          >
            {sendAndConfirmTx.isPending
              ? "Updating Platform Fee Settings"
              : "Update Platform Fee Settings"}
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
