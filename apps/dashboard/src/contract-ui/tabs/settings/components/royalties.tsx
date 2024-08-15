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
  getDefaultRoyaltyInfo,
  setDefaultRoyaltyInfo,
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
import { z } from "zod";
import { SettingDetectedState } from "./detected-state";

/**
 * @internal
 */
const CommonRoyaltySchema = z.object({
  /**
   * The amount of royalty collected on all royalties represented as basis points.
   * The default is 0 (no royalties).
   *
   * 1 basis point = 0.01%
   *
   * For example: if this value is 100, then the royalty is 1% of the total sales.
   *
   * @internal
   * @remarks used by OpenSea "seller_fee_basis_points"
   */
  seller_fee_basis_points: BasisPointsSchema.default(0),

  /**
   * The address of the royalty recipient. All royalties will be sent
   * to this address.
   * @internal
   * @remarks used by OpenSea "fee_recipient"
   */
  fee_recipient: AddressOrEnsSchema.default(ZERO_ADDRESS),
});

export const SettingsRoyalties = ({
  contract,
  detectedState,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
}) => {
  const trackEvent = useTrack();
  const query = useReadContract(getDefaultRoyaltyInfo, {
    contract,
  });
  const royaltyInfo = query.data
    ? { seller_fee_basis_points: query.data[1], fee_recipient: query.data[0] }
    : undefined;
  const mutation = useSendAndConfirmTransaction();
  const form = useForm<z.input<typeof CommonRoyaltySchema>>({
    resolver: zodResolver(CommonRoyaltySchema),
    defaultValues: royaltyInfo,
    values: royaltyInfo,
  });

  const address = useActiveAccount()?.address;

  const { onSuccess, onError } = useTxNotifications(
    "Royalty settings updated",
    "Error updating royalty settings",
    contract,
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="royalties" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={form.handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-royalty",
            label: "attempt",
          });
          // In the v4 hook we defaulted recipient to address_zero and bps to `0`
          // but let's actually throw an error here for better transparency
          if (!d.seller_fee_basis_points) {
            return toast.error("Please enter valid basis points.");
          }
          if (!d.fee_recipient) {
            return toast.error("Please enter a valid royalty fee recipient.");
          }
          const transaction = setDefaultRoyaltyInfo({
            contract,
            royaltyRecipient: d.fee_recipient,
            royaltyBps: BigInt(d.seller_fee_basis_points),
          });
          mutation.mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "settings",
                action: "set-royalty",
                label: "success",
              });
              form.reset(d);
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "settings",
                action: "set-royalty",
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
          <Heading size="title.sm">Royalties</Heading>
          <Text size="body.md" fontStyle="italic">
            The wallet address that should receive the revenue from royalties
            earned from secondary sales of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isInvalid={
                !!form.getFieldState("fee_recipient", form.formState).error
              }
              isDisabled={!address}
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                solidityType="address"
                formContext={form}
                variant="filled"
                {...form.register("fee_recipient")}
                isDisabled={!address}
              />
              <FormErrorMessage>
                {
                  form.getFieldState("fee_recipient", form.formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
            <FormControl
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!form.getFieldState("seller_fee_basis_points", form.formState)
                  .error
              }
              isDisabled={!address}
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                variant="filled"
                value={form.watch("seller_fee_basis_points")}
                onChange={(value) =>
                  form.setValue("seller_fee_basis_points", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
              <FormErrorMessage>
                {
                  form.getFieldState("seller_fee_basis_points", form.formState)
                    .error?.message
                }
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
        <AdminOnly contract={contract}>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={query.isLoading || !form.formState.isDirty}
            type="submit"
            isLoading={mutation.isPending}
            loadingText="Saving..."
            size="md"
            borderRadius="xl"
            borderTopLeftRadius="0"
            borderTopRightRadius="0"
          >
            Update Royalty Settings
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
