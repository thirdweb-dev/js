import { ButtonGroup, Flex } from "@chakra-ui/react";
import {
  type ContractWithRoles,
  type RolesForContract,
  useAllRoleMembers,
  useContractType,
  useSetAllRoleMembers,
} from "@thirdweb-dev/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { BuiltinContractMap, ROLE_DESCRIPTION_MAP } from "constants/mappings";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { roleMap } from "thirdweb/extensions/permissions";
import { Button } from "tw-components";
import { ContractPermission } from "./contract-permission";

type PermissionFormContext<TContract extends ContractWithRoles> = {
  [role in RolesForContract<TContract>]: string[];
};

export const Permissions = <TContract extends ContractWithRoles>({
  contract,
}: {
  contract: TContract;
}) => {
  const trackEvent = useTrack();
  const allRoleMembers = useAllRoleMembers(contract);
  const setAllRoleMembers = useSetAllRoleMembers(contract);

  const transformedQueryData = useMemo(() => {
    if (!allRoleMembers.data) {
      return {};
    }
    return allRoleMembers.data as PermissionFormContext<TContract>;
  }, [allRoleMembers.data]);

  const form = useForm({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const { data: contractType } = useContractType(contract.getAddress());
  const contractData =
    BuiltinContractMap[contractType as keyof typeof BuiltinContractMap];

  const { onSuccess, onError } = useTxNotifications(
    "Permissions updated",
    "Failed to update permissions",
  );

  const roles = useMemo(() => {
    return Object.keys(allRoleMembers.data || ROLE_DESCRIPTION_MAP).filter(
      (role) =>
        contractData && contractData.contractType !== "custom"
          ? contractData.roles?.includes(role as keyof typeof roleMap)
          : true,
    );
  }, [allRoleMembers.data, contractData]);

  const isPrebuilt =
    BuiltinContractMap[contractType as keyof typeof BuiltinContractMap]
      .contractType !== "custom";

  return (
    <FormProvider {...form}>
      <Flex
        gap={4}
        direction="column"
        as="form"
        onSubmit={form.handleSubmit((d) => {
          trackEvent({
            category: "permissions",
            action: "set-permissions",
            label: "attempt",
          });
          // if we switch back to mutateAsync then *need* to catch errors
          setAllRoleMembers.mutate(d as PermissionFormContext<TContract>, {
            onSuccess: (_data, variables) => {
              trackEvent({
                category: "permissions",
                action: "set-permissions",
                label: "success",
              });
              form.reset(variables);
              onSuccess();
            },
            onError: (error) => {
              trackEvent({
                category: "permissions",
                action: "set-permissions",
                label: "error",
                error,
              });
              onError(error);
            },
          });
        })}
      >
        {roles.map((role) => {
          return (
            <ContractPermission
              isLoading={allRoleMembers.isLoading}
              key={role}
              role={role}
              description={ROLE_DESCRIPTION_MAP[role] || ""}
              isPrebuilt={isPrebuilt}
              contract={contract}
            />
          );
        })}
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
