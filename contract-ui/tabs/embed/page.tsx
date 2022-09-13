import { EmbedSetup } from "./components/embed-setup";
import { Flex } from "@chakra-ui/react";
import { useContract, useContractType } from "@thirdweb-dev/react";

interface CustomContractEmbedPageProps {
  contractAddress?: string;
}

export const CustomContractEmbedPage: React.FC<
  CustomContractEmbedPageProps
> = ({ contractAddress }) => {
  const contractQuery = useContract(contractAddress);
  const { data: contractType } = useContractType(contractAddress);

  if (contractQuery.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contractQuery?.contract && (
        <EmbedSetup
          contract={contractQuery.contract}
          contractType={contractType}
        />
      )}
    </Flex>
  );
};
