import { Flex } from "@chakra-ui/react";
import { useContract, useContractFunctions } from "@thirdweb-dev/react";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { Heading } from "tw-components";

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
        <Flex direction="column" gap={6}>
          <Heading size="title.sm">Contract Explorer</Heading>
          <ContractFunctionsOverview
            onlyFunctions
            functions={functionsQuery.data}
            contract={contract}
          />
        </Flex>
      )}
    </Flex>
  );
};
