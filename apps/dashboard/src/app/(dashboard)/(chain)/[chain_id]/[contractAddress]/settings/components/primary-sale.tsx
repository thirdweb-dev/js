"use client";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { TransactionButton } from "components/buttons/TransactionButton";
import { AddressOrEnsSchema } from "constants/schemas";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import {
  primarySaleRecipient,
  setPrimarySaleRecipient,
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

const CommonPrimarySaleSchema = z.object({
  primary_sale_recipient: AddressOrEnsSchema.default(ZERO_ADDRESS),
});

export const SettingsPrimarySale = ({
  contract,
  detectedState,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
}) => {
  const address = useActiveAccount()?.address;
  const trackEvent = useTrack();
  const query = useReadContract(primarySaleRecipient, {
    contract,
  });
  const mutation = useSendAndConfirmTransaction();

  const transformedQueryData = {
    primary_sale_recipient: query.data,
  };

  const form = useForm<z.input<typeof CommonPrimarySaleSchema>>({
    resolver: zodResolver(CommonPrimarySaleSchema),
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Primary sale address updated",
    "Error updating primary sale address",
    contract,
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="primarySale" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={form.handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-primary-sale",
            label: "attempt",
          });
          const saleRecipient = d.primary_sale_recipient;
          if (!saleRecipient) {
            return toast.error(
              "Please enter a valid primary sale recipient address",
            );
          }
          const transaction = setPrimarySaleRecipient({
            contract,
            saleRecipient,
          });
          // if we switch back to mutateAsync then *need* to catch errors
          mutation.mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "settings",
                action: "set-primary-sale",
                label: "success",
              });
              form.reset({ primary_sale_recipient: saleRecipient });
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "settings",
                action: "set-primary-sale",
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
          <Heading size="title.sm">Primary Sales</Heading>
          <Text size="body.md" fontStyle="italic">
            The wallet address that should receive the revenue from initial
            sales of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isDisabled={mutation.isPending || !address}
              isInvalid={
                !!form.getFieldState("primary_sale_recipient", form.formState)
                  .error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                isDisabled={mutation.isPending || !address}
                solidityType="address"
                formContext={form}
                variant="filled"
                {...form.register("primary_sale_recipient")}
              />
              <FormErrorMessage>
                {
                  form.getFieldState("primary_sale_recipient", form.formState)
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
          >
            {mutation.isPending
              ? "Updating Primary Sale Settings"
              : "Update Primary Sale Settings"}
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
