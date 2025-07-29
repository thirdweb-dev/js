"use client";

import { RotateCcwIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebContract } from "thirdweb";
import {
  useActiveAccount,
  useReadContract,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROLE_DESCRIPTION_MAP } from "@/constants/mappings";
import {
  createSetAllRoleMembersTx,
  getAllRoleMembers,
} from "@/hooks/contract-ui/permissions";
import { parseError } from "@/utils/errorParser";
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

  const roles = useMemo(() => {
    return Object.keys(allRoleMembers.data || ROLE_DESCRIPTION_MAP);
  }, [allRoleMembers.data]);

  return (
    <Form {...form}>
      <form
        className="bg-card rounded-lg border"
        onSubmit={form.handleSubmit((values) => {
          if (!account) {
            toast.error("Wallet not connected!");
            return;
          }

          // remove empty values
          const cleanedValues: { [k: string]: string[] } = {};

          for (const k in values) {
            const originalValue = values[k];
            if (originalValue) {
              const cleanedValue: string[] = [];
              for (const v of originalValue) {
                if (v !== "") {
                  cleanedValue.push(v);
                }
              }
              cleanedValues[k] = cleanedValue;
            }
          }

          const tx = createSetAllRoleMembersTx({
            account,
            contract,
            roleMemberMap: cleanedValues,
          });

          sendTx.mutate(tx, {
            onError: (error) => {
              toast.error("Failed to update permissions", {
                description: parseError(error),
              });
            },
            onSuccess: () => {
              toast.success("Permissions updated successfully");
            },
          });
        })}
      >
        <div>
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
        </div>

        <div className="flex justify-end gap-3 p-4 lg:p-6">
          <Button
            variant="outline"
            disabled={!allRoleMembers.data || sendTx.isPending}
            onClick={() => form.reset(allRoleMembers.data)}
            className="gap-2 bg-background"
          >
            <RotateCcwIcon className="size-4 text-muted-foreground" />
            Reset
          </Button>
          <TransactionButton
            client={contract.client}
            isLoggedIn={isLoggedIn}
            isPending={sendTx.isPending}
            transactionCount={undefined}
            txChainID={contract.chain.id}
            type="submit"
            variant="default"
          >
            {sendTx.isPending ? "Updating permissions" : "Update permissions"}
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
}
