import { CodeOverview } from "./components/code-overview";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { ContractCode } from "components/contract-tabs/code/ContractCode";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractCodePage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const contract = useContract(contractAddress);
  const contractType = contract.data?.contractType;

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contract?.contract && contractType === "custom" ? (
        <CodeOverview contract={contract.contract} />
      ) : (
        contractType && (
          <ContractCode
            contract={contract.contract}
            contractType={contractType}
          />
        )
      )}
    </Flex>
  );
};
