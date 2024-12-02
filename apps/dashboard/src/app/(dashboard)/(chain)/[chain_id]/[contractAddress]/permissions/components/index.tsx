"use client";

import { ButtonGroup, Flex } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { ROLE_DESCRIPTION_MAP } from "constants/mappings";
import {
  createSetAllRoleMembersTx,
  getAllRoleMembers,
} from "contract-ui/hooks/permissions";
import { useTrack } from "hooks/analytics/useTrack";
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
}: {
  contract: ThirdwebContract;
}) {
  const trackEvent = useTrack();
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
        gap={4}
        direction="column"
        as="form"
        onSubmit={form.handleSubmit((d) => {
          if (!account) {
            onError(new Error("Wallet not connected!"));
            return;
          }
          trackEvent({
            category: "permissions",
            action: "set-permissions",
            label: "attempt",
          });
          const tx = createSetAllRoleMembersTx({
            account,
            contract,
            roleMemberMap: d,
          });
          sendTx.mutate(tx, {
            onSuccess: () => {
              trackEvent({
                category: "permissions",
                action: "set-permissions",
                label: "success",
              });
              form.reset(d);
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
              isPending={allRoleMembers.isPending}
              key={role}
              role={role}
              description={ROLE_DESCRIPTION_MAP[role] || ""}
              contract={contract}
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
            txChainID={contract.chain.id}
            transactionCount={1}
            disabled={!form.formState.isDirty}
            type="submit"
            isPending={sendTx.isPending}
          >
            {sendTx.isPending ? "Updating permissions" : "Update permissions"}
          </TransactionButton>
        </ButtonGroup>
      </Flex>
    </FormProvider>
  );
}
