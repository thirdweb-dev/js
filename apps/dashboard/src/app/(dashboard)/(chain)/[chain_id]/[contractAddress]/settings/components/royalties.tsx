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
  seller_fee_basis_points: BasisPointsSchema,

  /**
   * The address of the royalty recipient. All royalties will be sent
   * to this address.
   * @internal
   * @remarks used by OpenSea "fee_recipient"
   */
  fee_recipient: AddressOrEnsSchema,
});

export const SettingsRoyalties = ({
  contract,
  detectedState,
  twAccount,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  twAccount: Account | undefined;
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
                {...form.register("fee_recipient")}
                disabled={!address}
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
            txChainID={contract.chain.id}
            transactionCount={1}
            disabled={query.isPending || !form.formState.isDirty}
            type="submit"
            isPending={mutation.isPending}
            className="!rounded-t-none rounded-xl"
            twAccount={twAccount}
          >
            {mutation.isPending
              ? "Updating Royalty Settings"
              : "Update Royalty Settings"}
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
