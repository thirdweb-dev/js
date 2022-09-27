import { SettingDetectedState } from "./detected-state";
import { AdminOnly } from "@3rdweb-sdk/react";
import { Flex, FormControl, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useRoyaltySettings,
  useUpdateRoyaltySettings,
} from "@thirdweb-dev/react";
import { CommonRoyaltySchema, ValidContractInstance } from "@thirdweb-dev/sdk";
import { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
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
  const {
    handleSubmit,
    getFieldState,
    formState,
    register,
    reset,
    watch,
    setValue,
  } = useForm<z.input<typeof CommonRoyaltySchema>>({
    resolver: zodResolver(CommonRoyaltySchema),
  });
  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, formState.isDirty]);

  const { onSuccess, onError } = useTxNotifications(
    "Royalty settings updated",
    "Error updating royalty settings",
  );

  return (
    <Card p={0} position="relative">
      <SettingDetectedState type="royalties" detectedState={detectedState} />
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-royalty",
            label: "attempt",
          });
          mutation.mutateAsync(d, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "settings",
                action: "set-royalty",
                label: "success",
              });
              reset(variables);
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
              isInvalid={!!getFieldState("fee_recipient", formState).error}
            >
              <FormLabel>Recipient Address</FormLabel>
              <Input variant="filled" {...register("fee_recipient")} />
              <FormErrorMessage>
                {getFieldState("fee_recipient", formState).error?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!getFieldState("seller_fee_basis_points", formState).error
              }
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                variant="filled"
                value={watch("seller_fee_basis_points")}
                onChange={(value) =>
                  setValue("seller_fee_basis_points", value, {
                    shouldTouch: true,
                  })
                }
              />
              <FormErrorMessage>
                {
                  getFieldState("seller_fee_basis_points", formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
        <AdminOnly contract={contract as ValidContractInstance}>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={query.isLoading || !formState.isDirty}
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
