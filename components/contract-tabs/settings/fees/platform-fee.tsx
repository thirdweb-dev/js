import {
  AdminOnly,
  PlatformFeeContract,
  useContractPlatformFee,
  useContractPlatformFeeMutation,
} from "@3rdweb-sdk/react";
import { Flex, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonPlatformFeeSchema } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, FormLabel, Heading, Text } from "tw-components";
import { z } from "zod";

export const ContractPlatformFee = <TContract extends PlatformFeeContract>({
  contract,
  isDisabled,
}: {
  contract: TContract;
  isDisabled: boolean;
}) => {
  const query = useContractPlatformFee(contract);
  const mutation = useContractPlatformFeeMutation(contract);
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
        onSubmit={handleSubmit((d) =>
          mutation.mutateAsync(d, {
            onSuccess: (_data, variables) => {
              reset(variables);
              onSuccess();
            },
            onError,
          }),
        )}
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
              isDisabled={isDisabled}
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
              isDisabled={isDisabled}
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
        <AdminOnly contract={contract}>
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
        </AdminOnly>
      </Flex>
    </Card>
  );
};
