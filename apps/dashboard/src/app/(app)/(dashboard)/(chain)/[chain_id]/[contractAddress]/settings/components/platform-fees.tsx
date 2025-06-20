"use client";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { AddressOrEnsSchema, BasisPointsSchema } from "constants/schemas";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
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
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const address = useActiveAccount()?.address;
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const platformFeesQuery = useReadContract(getPlatformFeeInfo, { contract });
  const platformFeeInfo = platformFeesQuery.data
    ? {
        platform_fee_basis_points: platformFeesQuery.data[1],
        platform_fee_recipient: platformFeesQuery.data[0],
      }
    : undefined;

  const form = useForm<z.input<typeof CommonPlatformFeeSchema>>({
    defaultValues: platformFeeInfo,
    resolver: zodResolver(CommonPlatformFeeSchema),
    values: platformFeeInfo,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Platform fee settings updated",
    "Error updating platform fee settings",
    contract,
  );

  return (
    <Card overflow="hidden" p={0} position="relative">
      <SettingDetectedState detectedState={detectedState} type="platformFee" />
      <Flex
        as="form"
        direction="column"
        onSubmit={form.handleSubmit((data) => {
          const transaction = setPlatformFeeInfo({
            contract,
            platformFeeBps: BigInt(data.platform_fee_basis_points),
            platformFeeRecipient: data.platform_fee_recipient,
          });
          sendAndConfirmTx.mutate(transaction, {
            onError: (error) => {
              console.error(error);
              onError(error);
            },
            onSuccess: () => {
              form.reset(data);
              onSuccess();
            },
          });
        })}
      >
        <Flex as="section" direction="column" gap={4} p={{ base: 6, md: 10 }}>
          <Heading size="title.sm">Platform fee</Heading>
          <Text fontStyle="italic" size="body.md">
            The wallet address that should receive the revenue from platform
            fees.
          </Text>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <FormControl
              isDisabled={!address}
              isInvalid={
                !!form.getFieldState("platform_fee_recipient", form.formState)
                  .error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                client={contract.client}
                formContext={form}
                solidityType="address"
                {...form.register("platform_fee_recipient")}
                disabled={!address || sendAndConfirmTx.isPending}
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
              isInvalid={
                !!form.getFieldState(
                  "platform_fee_basis_points",
                  form.formState,
                ).error
              }
              maxW={{ base: "100%", md: "200px" }}
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                disabled={sendAndConfirmTx.isPending}
                onChange={(value) =>
                  form.setValue("platform_fee_basis_points", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                value={form.watch("platform_fee_basis_points")}
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
            className="!rounded-t-none rounded-xl"
            client={contract.client}
            disabled={platformFeesQuery.isPending || !form.formState.isDirty}
            isLoggedIn={isLoggedIn}
            isPending={sendAndConfirmTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
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
