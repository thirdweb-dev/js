"use client";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "chakra/card";
import { FormErrorMessage, FormLabel } from "chakra/form";
import { Heading } from "chakra/heading";
import { Text } from "chakra/text";
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
import { z } from "zod";
import { BasisPointsInput } from "@/components/blocks/BasisPointsInput";
import { AdminOnly } from "@/components/contracts/roles/admin-only";
import { SolidityInput } from "@/components/solidity-inputs";
import { TransactionButton } from "@/components/tx-button";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { AddressOrEnsSchema, BasisPointsSchema } from "@/schema/schemas";
import type { ExtensionDetectedState } from "@/types/ExtensionDetectedState";
import { SettingDetectedState } from "./detected-state";

/**
 * @internal
 */
const CommonRoyaltySchema = z.object({
  /**
   * The address of the royalty recipient. All royalties will be sent
   * to this address.
   * @internal
   * @remarks used by OpenSea "fee_recipient"
   */
  fee_recipient: AddressOrEnsSchema,
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
});

export const SettingsRoyalties = ({
  contract,
  detectedState,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const query = useReadContract(getDefaultRoyaltyInfo, {
    contract,
  });
  const royaltyInfo = query.data
    ? { fee_recipient: query.data[0], seller_fee_basis_points: query.data[1] }
    : undefined;
  const mutation = useSendAndConfirmTransaction();
  const form = useForm<z.input<typeof CommonRoyaltySchema>>({
    defaultValues: royaltyInfo,
    resolver: zodResolver(CommonRoyaltySchema),
    values: royaltyInfo,
  });

  const address = useActiveAccount()?.address;

  const { onSuccess, onError } = useTxNotifications(
    "Royalty settings updated",
    "Error updating royalty settings",
    contract,
  );

  return (
    <Card overflow="hidden" p={0} position="relative">
      <SettingDetectedState detectedState={detectedState} type="royalties" />
      <Flex
        as="form"
        direction="column"
        onSubmit={form.handleSubmit((d) => {
          const transaction = setDefaultRoyaltyInfo({
            contract,
            royaltyBps: BigInt(d.seller_fee_basis_points),
            royaltyRecipient: d.fee_recipient,
          });
          mutation.mutate(transaction, {
            onError: (error) => {
              console.error(error);
              onError(error);
            },
            onSuccess: () => {
              form.reset(d);
              onSuccess();
            },
          });
        })}
      >
        <Flex as="section" direction="column" gap={4} p={{ base: 6, md: 10 }}>
          <Heading size="title.sm">Royalties</Heading>
          <Text fontStyle="italic" size="body.md">
            The wallet address that should receive the revenue from royalties
            earned from secondary sales of the assets.
          </Text>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <FormControl
              isDisabled={!address}
              isInvalid={
                !!form.getFieldState("fee_recipient", form.formState).error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                client={contract.client}
                formContext={form}
                solidityType="address"
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
              isDisabled={!address}
              isInvalid={
                !!form.getFieldState("seller_fee_basis_points", form.formState)
                  .error
              }
              maxW={{ base: "100%", md: "200px" }}
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                onChange={(value) =>
                  form.setValue("seller_fee_basis_points", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                value={form.watch("seller_fee_basis_points")}
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
            className="!rounded-t-none rounded-xl"
            client={contract.client}
            disabled={query.isPending || !form.formState.isDirty}
            isLoggedIn={isLoggedIn}
            isPending={mutation.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
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
