import { MetadataHeader } from "./metadata-header";
import { Box } from "@chakra-ui/react";
import {
  contractType,
  useContract,
  useContractMetadata,
} from "@thirdweb-dev/react";
import { useEns } from "components/contract-components/hooks";
import { FeatureIconMap } from "constants/mappings";
import { useMemo } from "react";

interface ContractMetadataProps {
  contractAddress: string;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);

  const ensQuery = useEns(contractAddress);
  const metadataQuery = useContractMetadata(contract);
  const { data: cType } = contractType.useQuery(
    ensQuery.data?.address || undefined,
  );

  const contractTypeImage = useMemo(() => {
    return (
      (cType && cType !== "custom" && FeatureIconMap[cType]) ||
      FeatureIconMap["custom"]
    );
  }, [cType]);

  if (metadataQuery.isError) {
    return <Box>Failed to load contract metadata</Box>;
  }
  return (
    <MetadataHeader
      isLoaded={metadataQuery.isSuccess}
      data={metadataQuery.data}
      address={contractAddress}
      contractTypeImage={contractTypeImage}
    />
  );
};
