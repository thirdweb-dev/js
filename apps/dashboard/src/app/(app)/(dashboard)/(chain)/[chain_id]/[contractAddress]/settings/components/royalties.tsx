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
