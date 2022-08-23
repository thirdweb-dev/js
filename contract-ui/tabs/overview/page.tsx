import { Flex, Skeleton } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { useContractFunctions } from "components/contract-components/hooks";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { Heading } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const { contract } = useContract(contractAddress);
  const functionsQuery = useContractFunctions(contract);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <Heading size="title.sm">Contract Explorer</Heading>
        <Skeleton isLoaded={functionsQuery.isSuccess}>
          {contract && functionsQuery.data && (
            <ContractFunctionsOverview
              onlyFunctions
              functions={functionsQuery.data}
              contract={contract}
            />
          )}
        </Skeleton>
      </Flex>
    </Flex>
  );
};
