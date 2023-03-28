import { MetadataHeader } from "./metadata-header";
import { Chain } from "@thirdweb-dev/chains";
import type { useContractMetadata } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

interface ContractMetadataProps {
  contractAddress: string;
  metadataQuery: ReturnType<typeof useContractMetadata>;
  chain: Chain | null;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  metadataQuery,
  chain,
  contractAddress,
}) => {
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
      chain={chain || undefined}
      address={contractAddress}
    />
  );
};
