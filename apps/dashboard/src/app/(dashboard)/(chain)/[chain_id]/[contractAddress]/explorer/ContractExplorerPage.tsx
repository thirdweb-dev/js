import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { Abi } from "abitype";
import { getContractFunctionsFromAbi } from "components/contract-components/getContractFunctionsFromAbi";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { CircleAlertIcon } from "lucide-react";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";

interface ContractExplorePageProps {
  contract: ThirdwebContract;
  abi: Abi | undefined;
  chainMetadata: ChainMetadata;
  twAccount: Account | undefined;
}

export const ContractExplorerPage: React.FC<ContractExplorePageProps> = ({
  contract,
  abi,
  chainMetadata,
  twAccount,
}) => {
  if (!abi) {
    return (
      <Alert variant="destructive">
        <CircleAlertIcon className="size-5" />
        <AlertTitle>Failed to resolve contract ABI</AlertTitle>
        <AlertDescription>
          Please verify that contract address is correct and deployed on "
          {chainMetadata.name}" chain.
        </AlertDescription>
      </Alert>
    );
  }

  const functions = getContractFunctionsFromAbi(abi);
  return (
    <div className="flex h-[70vh] flex-col">
      {functions && functions.length > 0 ? (
        <ContractFunctionsOverview
          onlyFunctions
          functions={functions}
          contract={contract}
          twAccount={twAccount}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h2 className="font-semibold text-2xl tracking-tight">
            No callable functions discovered in ABI.
          </h2>
          <p className="text-muted-foreground text-sm">
            Please note that proxy contracts are not yet supported in the
            explorer, check back soon for full proxy support.
          </p>
        </div>
      )}
    </div>
  );
};
