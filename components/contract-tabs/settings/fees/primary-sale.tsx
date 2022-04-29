import {
  AdminOnly,
  RecipientContract,
  useSaleRecipient,
  useSetSaleRecipientMutation,
} from "@3rdweb-sdk/react";
import { Flex, FormControl, FormErrorMessage, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonPrimarySaleSchema } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, FormLabel, Heading, Text } from "tw-components";
import { z } from "zod";

export const ContractPrimarySale = <TContract extends RecipientContract>({
  contract,
  isDisabled,
}: {
  contract: TContract;
  isDisabled: boolean;
}) => {
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

  const { onSuccess, onError } = useTxNotifications(
    "Primary sale address updated",
    "Error updating primary sale address",
  );

  return (
    <Card p={0}>
      <Flex
        as="form"
        onSubmit={handleSubmit((d) =>
          mutation.mutateAsync(d.primary_sale_recipient, {
            onSuccess: (_data, variables) => {
              reset({ primary_sale_recipient: variables });
              onSuccess();
            },
            onError,
          }),
        )}
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
              isDisabled={mutation.isLoading || isDisabled}
              isInvalid={
                !!getFieldState("primary_sale_recipient", formState).error
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
            Update Primary Sale Settings
          </TransactionButton>
        </AdminOnly>
      </Flex>
    </Card>
  );
};
