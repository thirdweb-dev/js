import { MetadataHeader } from "./metadata-header";
import { Box } from "@chakra-ui/react";
import { useContract, useContractMetadata } from "@thirdweb-dev/react";

interface ContractMetadataProps {
  contractAddress: string;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);

  const metadataQuery = useContractMetadata(contract);

  if (metadataQuery.isError) {
    return <Box>Failed to load contract metadata</Box>;
  }
  return (
    <MetadataHeader
      isLoaded={metadataQuery.isSuccess}
      data={metadataQuery.data}
      address={contractAddress}
    />
  );
};
