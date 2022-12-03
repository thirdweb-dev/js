import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { useContractFunctions } from "components/contract-components/hooks";
import { ImportContract } from "components/contract-components/import-contract";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { Heading } from "tw-components";

interface CustomContractOverviewPageProps {
  contractAddress?: string;
}

export const CustomContractOverviewPage: React.FC<
  CustomContractOverviewPageProps
> = ({ contractAddress }) => {
  const { contract, isSuccess } = useContract(contractAddress);
  const functions = useContractFunctions(contract);

  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  if (!contract?.abi && isSuccess) {
    return <ImportContract contractAddress={contractAddress} />;
  }

  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <Heading size="title.sm">Contract Explorer</Heading>
        {contract && (
          <ContractFunctionsOverview
            onlyFunctions
            functions={functions}
            contract={contract}
          />
        )}
      </Flex>
    </Flex>
  );
};
