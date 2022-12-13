import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
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
  const { contract, isSuccess, isError } = useContract(contractAddress);
  const functions = useContractFunctions(contract?.abi as Abi);
  if (!contractAddress) {
    return <div>No contract address provided</div>;
  }

  if ((!contract?.abi && isSuccess) || isError) {
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
