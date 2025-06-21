"use client";

import { ButtonGroup, Flex } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { ROLE_DESCRIPTION_MAP } from "constants/mappings";
import {
  createSetAllRoleMembersTx,
  getAllRoleMembers,
} from "contract-ui/hooks/permissions";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { Button } from "tw-components";
import { ContractPermission } from "./contract-permission";

type PermissionFormContext = {
  [role: string]: string[];
};

export function Permissions({
  contract,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const account = useActiveAccount();
  const allRoleMembers = useReadContract(getAllRoleMembers, {
    contract,
  });
  const sendTx = useSendAndConfirmTransaction();

  const transformedQueryData = useMemo(() => {
    if (!allRoleMembers.data) {
      return {};
    }
    return allRoleMembers.data satisfies PermissionFormContext;
  }, [allRoleMembers.data]);

  const form = useForm({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const { onSuccess, onError } = useTxNotifications(
    "Permissions updated",
    "Failed to update permissions",
  );

  const roles = useMemo(() => {
    return Object.keys(allRoleMembers.data || ROLE_DESCRIPTION_MAP);
  }, [allRoleMembers.data]);

  return (
    <FormProvider {...form}>
      <Flex
        as="form"
        direction="column"
        gap={4}
        onSubmit={form.handleSubmit((d) => {
          if (!account) {
            onError(new Error("Wallet not connected!"));
            return;
          }
          const tx = createSetAllRoleMembersTx({
            account,
            contract,
            roleMemberMap: d,
          });
          sendTx.mutate(tx, {
            onError: (error) => {
              onError(error);
            },
            onSuccess: () => {
              form.reset(d);
              onSuccess();
            },
          });
        })}
      >
        {roles.map((role) => {
          return (
            <ContractPermission
              contract={contract}
              description={ROLE_DESCRIPTION_MAP[role] || ""}
              isPending={allRoleMembers.isPending}
              key={role}
              role={role}
            />
          );
        })}
        <ButtonGroup justifyContent="flex-end">
          <Button
            borderRadius="md"
            isDisabled={
              !allRoleMembers.data ||
              sendTx.isPending ||
              !form.formState.isDirty
            }
            onClick={() => form.reset(allRoleMembers.data)}
          >
            Reset
          </Button>
          <TransactionButton
            client={contract.client}
            disabled={!form.formState.isDirty}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending}
            transactionCount={1}
            txChainID={contract.chain.id}
            type="submit"
          >
            {sendTx.isPending ? "Updating permissions" : "Update permissions"}
          </TransactionButton>
        </ButtonGroup>
      </Flex>
    </FormProvider>
  );
}
