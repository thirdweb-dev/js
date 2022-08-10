import { Flex } from "@chakra-ui/react";
import { useContract, useContractFunctions } from "@thirdweb-dev/react";
import { useContractEvents } from "components/contract-components/hooks";
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
  const eventsQuery = useContractEvents(contract);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }
  return (
    <Flex direction="column" gap={8}>
      {contract && functionsQuery.data && (
        <Flex direction="column" gap={6}>
          <Heading size="title.sm">Contract Explorer</Heading>
          <ContractFunctionsOverview
            functions={functionsQuery.data}
            events={eventsQuery?.data}
            contract={contract}
          />
        </Flex>
      )}
    </Flex>
  );
};
