import { CodeOverview } from "./components/code-overview";
import { Flex } from "@chakra-ui/react";
import { useContract, useContractType } from "@thirdweb-dev/react";
import { Abi } from "@thirdweb-dev/sdk";
import { ContractCode } from "components/contract-tabs/code/ContractCode";
import { useEffect } from "react";

interface ContractCodePageProps {
  contractAddress?: string;
}

export const ContractCodePage: React.FC<ContractCodePageProps> = ({
  contractAddress,
}) => {
  const contractQuery = useContract(contractAddress);
  const { data: contractType, isLoading } = useContractType(contractAddress);

  const usePrebuiltCodeTab =
    contractType === "marketplace" ||
    contractType === "pack" ||
    contractType === "multiwrap";

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (contractQuery.isLoading || isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!contractQuery?.contract) {
    return null;
  }

  return (
    <Flex direction="column" gap={6}>
      {usePrebuiltCodeTab ? (
        <ContractCode
          contractAddress={contractQuery.contract?.getAddress()}
          contractType={contractType}
        />
      ) : (
        <CodeOverview
          abi={contractQuery.contract?.abi as Abi}
          contractAddress={contractQuery.contract?.getAddress()}
        />
      )}
    </Flex>
  );
};
