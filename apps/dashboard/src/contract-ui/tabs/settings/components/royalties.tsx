import { AdminOnly } from "@3rdweb-sdk/react/components/roles/admin-only";
import { Flex, FormControl } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoyaltySettings,
  useUpdateRoyaltySettings,
} from "@thirdweb-dev/react";
import {
  CommonRoyaltySchema,
  type ValidContractInstance,
} from "@thirdweb-dev/sdk";
import type { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { useActiveAccount } from "thirdweb/react";
import {
  Card,
  FormErrorMessage,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import type { z } from "zod";
import { SettingDetectedState } from "./detected-state";

export const SettingsRoyalties = <
  TContract extends ValidContractInstance | undefined,
>({
  contract,
  detectedState,
}: {
  contract: TContract;
  detectedState: ExtensionDetectedState;
}) => {
  const trackEvent = useTrack();
  const query = useRoyaltySettings(contract);
  const mutation = useUpdateRoyaltySettings(contract);

  const form = useForm<z.input<typeof CommonRoyaltySchema>>({
    resolver: zodResolver(CommonRoyaltySchema),
    defaultValues: query.data,
    values: query.data,
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
          // if we switch back to mutateAsync then *need* to catch errors
          mutation.mutate(d, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "settings",
                action: "set-royalty",
                label: "success",
              });
              form.reset(variables);
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
            Determine the address that should receive the revenue from royalties
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
            Update Royalty Settings
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
