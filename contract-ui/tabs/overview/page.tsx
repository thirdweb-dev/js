import { Flex } from "@chakra-ui/react";
import { useContract, useContractFunctions } from "@thirdweb-dev/react";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const { contract } = useContract(contractAddress);
  const functionsQuery = useContractFunctions(contractAddress);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  return (
    <Flex direction="column" gap={8}>
      {contract && functionsQuery.data && (
        <ContractFunctionsOverview
          functions={functionsQuery.data}
          contract={contract}
        />
      )}
    </Flex>
  );
};
