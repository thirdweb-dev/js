import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserXIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import { getInstalledModules, owner } from "thirdweb/modules";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { InstalledModulesTable } from "./components/InstalledModulesTable";
import { InstallModuleForm } from "./components/ModuleForm";

interface ContractEditModulesPageProps {
  contract: ThirdwebContract;
}

export const ContractEditModulesPage: React.FC<
  ContractEditModulesPageProps
> = ({ contract }) => {
  const account = useActiveAccount();

  const installedModulesQuery = useReadContract(getInstalledModules, {
    contract,
  });

  const ownerQuery = useReadContract(owner, {
    contract,
  });

  if (ownerQuery.isLoading) {
    return (
      <div className="items-center justify-center flex h-[300px] md:h-[500px]">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!ownerQuery.data) {
    return (
      <div className="items-center justify-center flex h-[300px] md:h-[500px]">
        <p className="text-red-500"> Failed to resolve contract owner </p>
      </div>
    );
  }

  const isOwner = ownerQuery.data === account?.address;

  const installedModules = {
    isLoading: installedModulesQuery.isLoading,
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
            <h2 className="text-2xl tracking-tight font-bold mb-1">
              Edit Modules
            </h2>
            <p className="text-muted-foreground">
              Add capabilities to your contract by installing modules
            </p>
          </div>
          <div className="h-10" />
          <InstallModuleForm
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
                You do not have permissions to edit modules{" "}
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
      />
    </div>
  );
};
