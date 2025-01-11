"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { UserXIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { getInstalledModules, owner } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { InstalledModulesTable } from "./components/InstalledModulesTable";
import { InstallModuleForm } from "./components/ModuleForm";

interface ContractEditModulesPageProps {
  contract: ThirdwebContract;
  twAccount: Account | undefined;
}

export const ContractEditModulesPage: React.FC<
  ContractEditModulesPageProps
> = ({ contract, twAccount }) => {
  const account = useActiveAccount();

  const installedModulesQuery = useReadContract(getInstalledModules, {
    contract,
  });

  const ownerQuery = useReadContract(owner, {
    contract,
  });

  if (ownerQuery.isPending) {
    return (
      <div className="flex h-[300px] items-center justify-center md:h-[500px]">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!ownerQuery.data) {
    return (
      <div className="flex h-[300px] items-center justify-center md:h-[500px]">
        <p className="text-red-500"> Failed to resolve contract owner </p>
      </div>
    );
  }

  const isOwner = ownerQuery.data === account?.address;

  const installedModules = {
    isPending: installedModulesQuery.isPending,
    data: installedModulesQuery.data
      ? installedModulesQuery.data.map((x) => x.implementation)
      : [],
  };

  return (
    <div>
      {/* Alert */}
      {isOwner && (
        <div>
          <div>
            <h2 className="mb-1 font-bold text-2xl tracking-tight">
              Edit Modules
            </h2>
            <p className="text-muted-foreground">
              Add capabilities to your contract by installing modules
            </p>
          </div>
          <div className="h-10" />
          <InstallModuleForm
            twAccount={twAccount}
            contract={contract}
            refetchModules={() => installedModulesQuery.refetch()}
            account={account}
            installedModules={installedModules}
          />
        </div>
      )}

      {!isOwner && (
        <Alert variant="destructive">
          <div className="flex gap-3">
            <UserXIcon className="size-6 text-red-400" />
            <div>
              <AlertTitle>
                You do not have permissions to edit modules
              </AlertTitle>
              <AlertDescription>
                Connect owner wallet to edit modules
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <div className="h-10" />

      <InstalledModulesTable
        installedModules={installedModules}
        refetchModules={() => installedModulesQuery.refetch()}
        contract={contract}
        ownerAccount={isOwner ? account : undefined}
        twAccount={twAccount}
      />
    </div>
  );
};
