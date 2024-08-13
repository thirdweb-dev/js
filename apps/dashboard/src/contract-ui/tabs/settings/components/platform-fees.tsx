import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { AddressOrEnsSchema, BasisPointsSchema } from "constants/schemas";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
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
  platform_fee_basis_points: BasisPointsSchema.default(0),
  /**
   * platform fee recipient address
   */
  platform_fee_recipient: AddressOrEnsSchema.default(ZERO_ADDRESS),
});

export const SettingsPlatformFees = ({
  contract,
  detectedState,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
}) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const { mutate, isPending } = useSendAndConfirmTransaction();
  const { data, isLoading } = useReadContract(getPlatformFeeInfo, { contract });
  const platformFeeInfo = data
    ? { platform_fee_recipient: data[0], platform_fee_basis_points: data[1] }
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
          // In the v4 hook we defaulted recipient to address_zero and bps to `0`
          // but let's actually throw an error here for better transparency
          if (!data.platform_fee_basis_points) {
            return toast.error("Please enter valid basis points.");
          }
          if (!data.platform_fee_recipient) {
            return toast.error("Please enter a valid platform fee recipient.");
          }
          const transaction = setPlatformFeeInfo({
            contract,
            platformFeeRecipient: data.platform_fee_recipient,
            platformFeeBps: BigInt(data.platform_fee_basis_points),
          });
          mutate(transaction, {
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
                isDisabled={!address || isPending}
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
                isDisabled={isPending}
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
            colorScheme="primary"
            transactionCount={1}
            isDisabled={isLoading || !form.formState.isDirty}
            type="submit"
            isLoading={isPending}
            loadingText="Saving..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
          >
            Update Platform Fee Settings
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
