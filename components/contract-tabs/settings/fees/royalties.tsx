import {
  AdminOnly,
  RoyaltyContract,
  useContractRoyalty,
  useContractRoyaltyMutation,
} from "@3rdweb-sdk/react";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonRoyaltySchema } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { Card } from "components/layout/Card";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { parseErrorToMessage } from "utils/errorParser";
import { z } from "zod";

export const ContractRoyalties = <TContract extends RoyaltyContract>({
  contract,
  isDisabled,
}: {
  contract: TContract;
  isDisabled: boolean;
}) => {
  const toast = useToast();
  const query = useContractRoyalty(contract);
  const mutation = useContractRoyaltyMutation(contract);
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

  return (
    <Card p={0}>
      <Flex
        as="form"
        onSubmit={handleSubmit((d) =>
          mutation.mutateAsync(d, {
            onSuccess: (_data, variables) => {
              reset(variables);
              toast({
                title: "Success",
                description: "Royalty settings updated",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            },
            onError: (error) => {
              toast({
                title: "Error updating royalty settings",
                description: parseErrorToMessage(error),
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
          }),
        )}
        direction="column"
        gap={8}
        pt={10}
      >
        <Flex direction="column" gap={2} px={10}>
          <Heading size="title.sm">Royalties</Heading>
          <Text size="body.md" fontStyle="italic">
            Determine the address that should receive the revenue from royalties
            earned from secondary sales of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isDisabled={isDisabled}
              isInvalid={!!getFieldState("fee_recipient", formState).invalid}
            >
              <FormLabel>Recipient Address</FormLabel>
              <Input variant="filled" {...register("fee_recipient")} />
              <FormErrorMessage>
                {getFieldState("fee_recipient", formState).error?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isDisabled={isDisabled}
              maxW={{ base: "100%", md: "200px" }}
              isInvalid={
                !!getFieldState("seller_fee_basis_points", formState).invalid
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
        <AdminOnly contract={contract} fallback={<Box pb={5} />}>
          <>
            <Divider />
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
          </>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
