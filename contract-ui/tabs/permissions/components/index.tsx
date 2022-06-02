import { ContractPermission } from "./contract-permission";
import { ButtonGroup, Flex } from "@chakra-ui/react";
import {
  ContractWithRoles,
  RolesForContract,
  useAllRoleMembers,
  useSetAllRoleMembers,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { ROLE_DESCRIPTION_MAP } from "constants/mappings";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "tw-components";

export type PermissionFormContext<TContract extends ContractWithRoles> = {
  [role in RolesForContract<TContract>]: string[];
};

export const Permissions = <TContract extends ContractWithRoles>({
  contract,
}: {
  contract: TContract;
}) => {
  const allRoleMembers = useAllRoleMembers(contract);
  const setAllRoleMembers = useSetAllRoleMembers(contract);
  console.log(allRoleMembers.data);
  console.log(allRoleMembers.data);
  const form = useForm({});

  useEffect(() => {
    if (allRoleMembers.data && !form.formState.isDirty) {
      form.reset(allRoleMembers.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRoleMembers.data]);

  const { onSuccess, onError } = useTxNotifications(
    "Permissions updated",
    "Failed to update permissions",
  );

  return (
    <FormProvider {...form}>
      <Flex
        gap={4}
        direction="column"
        as="form"
        onSubmit={form.handleSubmit((d) =>
          setAllRoleMembers.mutateAsync(d as PermissionFormContext<TContract>, {
            onSuccess: (_data, variables) => {
              form.reset(variables);
              onSuccess();
            },
            onError,
          }),
        )}
      >
        {Object.keys(allRoleMembers.data || ROLE_DESCRIPTION_MAP).map(
          (role) => {
            return (
              <ContractPermission
                isLoading={allRoleMembers.isLoading}
                key={role}
                role={role}
                contract={contract}
                description={ROLE_DESCRIPTION_MAP[role] || ""}
              />
            );
          },
        )}
        <ButtonGroup justifyContent="flex-end">
          <Button
            borderRadius="md"
            isDisabled={
              !allRoleMembers.data ||
              setAllRoleMembers.isLoading ||
              !form.formState.isDirty
            }
            onClick={() => form.reset(allRoleMembers.data)}
          >
            Reset
          </Button>
          <TransactionButton
            colorScheme="primary"
            transactionCount={1}
            isDisabled={!form.formState.isDirty}
            type="submit"
            isLoading={setAllRoleMembers.isLoading}
            loadingText="Saving permissions ..."
          >
            Update permissions
          </TransactionButton>
        </ButtonGroup>
      </Flex>
    </FormProvider>
  );
};
