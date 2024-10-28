import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Flex } from "@chakra-ui/react";
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
}

export const ContractExplorerPage: React.FC<ContractExplorePageProps> = ({
  contract,
  abi,
  chainMetadata,
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
    <Flex direction="column" h="70vh">
      {functions && functions.length > 0 ? (
        <ContractFunctionsOverview
          onlyFunctions
          functions={functions}
          contract={contract}
        />
      ) : (
        <div className="flex items-center justify-center">
          <Flex direction="column" textAlign="center" gap={2}>
            <h2 className="font-semibold text-2xl tracking-tight">
              No callable functions discovered in ABI.
            </h2>
            <p className="text-muted-foreground text-sm">
              Please note that proxy contracts are not yet supported in the
              explorer, check back soon for full proxy support.
            </p>
          </Flex>
        </div>
      )}
    </Flex>
  );
};
