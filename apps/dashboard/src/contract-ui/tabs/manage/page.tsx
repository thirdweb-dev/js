import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { UserXIcon } from "lucide-react";
import { useMemo } from "react";
import { defineChain, getContract } from "thirdweb";
import { getInstalledExtensions, owner } from "thirdweb/extensions/modular";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { thirdwebClient } from "../../../lib/thirdweb-client";
import { InstallExtensionForm } from "./components/ExtensionForm";
import { InstalledExtensionsTable } from "./components/InstalledExtensionsTable";

interface ContractEditExtensionsPageProps {
  contractAddress?: string;
}

export const ContractEditExtensionsPage: React.FC<
  ContractEditExtensionsPageProps
> = ({ contractAddress }) => {
  const contractInfo = useEVMContractInfo();

  const chainId = contractInfo?.chain?.chainId;

  if (!contractAddress || !chainId) {
    return (
      <div className="items-center justify-center flex h-[300px] md:h-[500px]">
        <Spinner className="size-10" />
      </div>
    );
  }

  return <Content contractAddress={contractAddress} chainId={chainId} />;
};

function Content(props: { contractAddress: string; chainId: number }) {
  const { contractAddress, chainId } = props;
  const account = useActiveAccount();

  const contract = useMemo(
    () =>
      getContract({
        client: thirdwebClient,
        address: contractAddress,
        chain: defineChain(chainId),
      }),
    [contractAddress, chainId],
  );

  const installedExtensionsQuery = useReadContract(getInstalledExtensions, {
    contract,
  });

  const ownerQuery = useReadContract(owner, {
    contract,
  });

  function refetchExtensions() {
    installedExtensionsQuery.refetch();
  }

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

  const installedExtensions = {
    isLoading: installedExtensionsQuery.isLoading,
    data: installedExtensionsQuery.data
      ? installedExtensionsQuery.data.map((x) => x.implementation)
      : [],
  };

  return (
    <div>
      {/* Alert */}
      {isOwner && (
        <div>
          <div>
            <h2 className="text-2xl tracking-tight font-bold mb-1">
              Edit Extensions
            </h2>
            <p className="text-secondary-foreground">
              Add capabilities to your contract by installing extensions
            </p>
          </div>
          <div className="h-10" />
          <InstallExtensionForm
            contract={contract}
            refetchExtensions={refetchExtensions}
            account={account}
            installedExtensions={installedExtensions}
          />
        </div>
      )}

      {!isOwner && (
        <Alert variant="destructive">
          <div className="flex gap-3">
            <UserXIcon className="size-6 text-red-400" />
            <div>
              <AlertTitle>
                You do not have permissions to edit extensions{" "}
              </AlertTitle>
              <AlertDescription>
                Connect owner wallet to edit extensions
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      <div className="h-10" />

      <InstalledExtensionsTable
        installedExtensions={installedExtensions}
        refetchExtensions={refetchExtensions}
        contract={contract}
        ownerAccount={isOwner ? account : undefined}
      />
    </div>
  );
}
