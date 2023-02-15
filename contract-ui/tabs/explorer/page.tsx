import { Flex, Skeleton } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { useContractFunctions } from "components/contract-components/hooks";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractExplorerPage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);

  const functions = useContractFunctions(contract?.abi as Abi);
  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  return (
    <Flex direction="column" h="70vh">
      <Skeleton height="100%" isLoaded={!!contract}>
        <ContractFunctionsOverview
          onlyFunctions
          functions={functions}
          contract={contract}
        />
      </Skeleton>
    </Flex>
  );
};
