import {
  AdminOnly,
  RecipientContract,
  useSaleRecipient,
  useSetSaleRecipientMutation,
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
import { CommonPrimarySaleSchema } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Card } from "components/layout/Card";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { parseErrorToMessage } from "utils/errorParser";
import { z } from "zod";

export const ContractPrimarySale = <TContract extends RecipientContract>({
  contract,
  isDisabled,
}: {
  contract: TContract;
  isDisabled: boolean;
}) => {
  const toast = useToast();
  const query = useSaleRecipient(contract);
  const mutation = useSetSaleRecipientMutation(contract);
  const { handleSubmit, getFieldState, formState, register, reset } = useForm<
    z.input<typeof CommonPrimarySaleSchema>
  >({
    resolver: zodResolver(CommonPrimarySaleSchema),
  });

  useEffect(() => {
    if (query.data && !formState.isDirty) {
      reset({ primary_sale_recipient: query.data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return (
    <Card p={0}>
      <Flex
        as="form"
        onSubmit={handleSubmit((d) =>
          mutation.mutateAsync(d.primary_sale_recipient, {
            onSuccess: (_data, variables) => {
              reset({ primary_sale_recipient: variables });
              toast({
                title: "Success",
                description: "Primary sale address updated",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            },
            onError: (error) => {
              toast({
                title: "Error updating recipient address",
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
          <Heading size="title.sm">Primary Sales</Heading>
          <Text size="body.md" fontStyle="italic">
            Determine the address that should receive the revenue from initial
            sales of the assets.
          </Text>
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            <FormControl
              isDisabled={mutation.isLoading || isDisabled}
              isInvalid={
                getFieldState("primary_sale_recipient", formState).invalid
              }
            >
              <FormLabel>Recipient Address</FormLabel>
              <Input variant="filled" {...register("primary_sale_recipient")} />
              <FormErrorMessage>
                {
                  getFieldState("primary_sale_recipient", formState).error
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
              Update Primary Sale Settings
            </TransactionButton>
          </>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
