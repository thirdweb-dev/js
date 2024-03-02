import { SettingDetectedState } from "./detected-state";
import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddress,
  usePrimarySaleRecipient,
  useUpdatePrimarySaleRecipient,
} from "@thirdweb-dev/react";
import {
  CommonPrimarySaleSchema,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import { z } from "zod";

export const SettingsPrimarySale = <
  TContract extends ValidContractInstance | undefined,
>({
  contract,
  detectedState,
}: {
  contract: TContract;
  detectedState: ExtensionDetectedState;
}) => {
  const address = useAddress();
  const trackEvent = useTrack();
  const query = usePrimarySaleRecipient(contract);
  const mutation = useUpdatePrimarySaleRecipient(contract);

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
          // if we switch back to mutateAsync then *need* to catch errors
          mutation.mutate(d.primary_sale_recipient as string, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "settings",
                action: "set-primary-sale",
                label: "success",
              });
              form.reset({ primary_sale_recipient: variables });
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
            Determine the address that should receive the revenue from initial
            sales of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isDisabled={mutation.isLoading || !address}
              isInvalid={
                !!form.getFieldState("primary_sale_recipient", form.formState)
                  .error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <SolidityInput
                isDisabled={mutation.isLoading || !address}
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
        <AdminOnly contract={contract as ValidContractInstance}>
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
            Update Primary Sale Settings
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
