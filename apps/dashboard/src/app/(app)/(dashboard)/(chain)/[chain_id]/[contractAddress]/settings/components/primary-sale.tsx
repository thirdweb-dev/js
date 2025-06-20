"use client";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectedState";
import { TransactionButton } from "components/buttons/TransactionButton";
import { AddressOrEnsSchema } from "constants/schemas";
import { SolidityInput } from "contract-ui/components/solidity-inputs";

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
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  detectedState: ExtensionDetectedState;
  isLoggedIn: boolean;
}) => {
  const address = useActiveAccount()?.address;

  const query = useReadContract(primarySaleRecipient, {
    contract,
  });
  const mutation = useSendAndConfirmTransaction();

  const transformedQueryData = {
    primary_sale_recipient: query.data,
  };

  const form = useForm<z.input<typeof CommonPrimarySaleSchema>>({
    defaultValues: transformedQueryData,
    resolver: zodResolver(CommonPrimarySaleSchema),
    values: transformedQueryData,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Primary sale address updated",
    "Error updating primary sale address",
    contract,
  );

  return (
    <Card overflow="hidden" p={0} position="relative">
      <SettingDetectedState detectedState={detectedState} type="primarySale" />
      <Flex
        as="form"
        direction="column"
        onSubmit={form.handleSubmit((d) => {
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
            onError: (error) => {
              console.error(error);
              onError(error);
            },
            onSuccess: () => {
              form.reset({ primary_sale_recipient: saleRecipient });
              onSuccess();
            },
          });
        })}
      >
        <Flex as="section" direction="column" gap={4} p={{ base: 6, md: 10 }}>
          <Heading size="title.sm">Primary Sales</Heading>
          <Text fontStyle="italic" size="body.md">
            The wallet address that should receive the revenue from initial
            sales of the assets.
          </Text>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <FormControl
              isDisabled={mutation.isPending || !address}
              isInvalid={
                !!form.getFieldState("primary_sale_recipient", form.formState)
                  .error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                client={contract.client}
                disabled={mutation.isPending || !address}
                formContext={form}
                solidityType="address"
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
              ? "Updating Primary Sale Settings"
              : "Update Primary Sale Settings"}
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
