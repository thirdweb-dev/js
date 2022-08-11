import { Flex, FormControl, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlatformFees, useUpdatePlatformFees } from "@thirdweb-dev/react";
import { CommonPlatformFeeSchema, SmartContract } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { PotentialContractInstance } from "contract-ui/types/types";
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

export const SettingsPlatformFees = <
  TContract extends PotentialContractInstance,
>({
  contract,
}: {
  contract: TContract;
}) => {
  const trackEvent = useTrack();
  const query = usePlatformFees(contract as SmartContract);
  const mutation = useUpdatePlatformFees(contract as SmartContract);
  const {
    handleSubmit,
    getFieldState,
    formState,
    register,
    reset,
    watch,
    setValue,
  } = useForm<z.input<typeof CommonPlatformFeeSchema>>({
    resolver: zodResolver(CommonPlatformFeeSchema),
  });
  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, formState.isDirty]);

  const { onSuccess, onError } = useTxNotifications(
    "Platform fee settings updated",
    "Error updating platform fee settings",
  );

  return (
    <Card p={0}>
      <Flex
        as="form"
        onSubmit={handleSubmit((d) => {
          trackEvent({
            category: "settings",
            action: "set-platform-fees",
            label: "attempt",
          });
          mutation.mutateAsync(d, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "settings",
                action: "set-platform-fees",
                label: "success",
              });
              reset(variables);
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
            Determine the address that should receive the revenue from platform
            fees.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isInvalid={
                !!getFieldState("platform_fee_recipient", formState).error
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <Input variant="filled" {...register("platform_fee_recipient")} />
              <FormErrorMessage>
                {
                  getFieldState("platform_fee_recipient", formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
            <FormControl
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!getFieldState("platform_fee_basis_points", formState).error
              }
            >
              <FormLabel>Percentage</FormLabel>
              <BasisPointsInput
                variant="filled"
                value={watch("platform_fee_basis_points")}
                onChange={(value) =>
                  setValue("platform_fee_basis_points", value, {
                    shouldTouch: true,
                  })
                }
              />
              <FormErrorMessage>
                {
                  getFieldState("platform_fee_basis_points", formState).error
                    ?.message
                }
              </FormErrorMessage>
            </FormControl>
          </Flex>
        </Flex>
        {/*         <AdminOnly contract={contract}> */}
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
          Update Platform Fee Settings
        </TransactionButton>
        {/*         </AdminOnly> */}
      </Flex>
    </Card>
  );
};
