import { MetadataHeader } from "./metadata-header";
import { useContract, useContractMetadata } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

interface ContractMetadataProps {
  contractAddress: string;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  contractAddress,
}) => {
  const { contract } = useContract(contractAddress);

  const metadataQuery = useContractMetadata(contract);

  const [wasError, setWasError] = useState(false);
  useEffect(() => {
    if (metadataQuery.isError) {
      setWasError(true);
    } else if (metadataQuery.isSuccess) {
      setWasError(false);
    }
  }, [metadataQuery.isError, metadataQuery.isSuccess]);

  return (
    <MetadataHeader
      isError={metadataQuery.isError || wasError}
      isLoaded={metadataQuery.isSuccess}
      data={metadataQuery.data}
      address={contractAddress}
    />
  );
};
