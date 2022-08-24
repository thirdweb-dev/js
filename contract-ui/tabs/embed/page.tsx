import { EmbedSetup } from "./components/embed-setup";
import { Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";

interface CustomContractEmbedPageProps {
  contractAddress?: string;
}

export const CustomContractEmbedPage: React.FC<
  CustomContractEmbedPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  return (
    <Flex direction="column" gap={6}>
      {contract?.contract && (
        <EmbedSetup
          contract={contract.contract}
          contractType={contract?.data?.contractType}
        />
      )}
    </Flex>
  );
};
