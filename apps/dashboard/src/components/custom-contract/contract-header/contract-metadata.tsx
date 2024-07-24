import { useContract, useContractMetadata } from "@thirdweb-dev/react";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { useEffect, useState } from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { MetadataHeader } from "./metadata-header";

interface ContractMetadataProps {
  contractAddress: string;
  chain: ChainMetadata | undefined;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  chain,
  contractAddress,
}) => {
  const [wasError, setWasError] = useState(false);

  const contractQuery = useContract(contractAddress);
  const contractMetadataQuery = useContractMetadata(contractQuery.contract);

  const publishedContractsFromDeploy = usePublishedContractsFromDeploy(
    contractAddress,
    chain?.chainId,
  );
  const latestPublished = publishedContractsFromDeploy.data?.slice(-1)[0];

  // legitimate, we use this to keep the state around and *only* flip it if the status changes explicitly from error to success etc
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (contractMetadataQuery.isError) {
      setWasError(true);
    } else if (contractMetadataQuery.isSuccess) {
      setWasError(false);
    }
  }, [contractMetadataQuery.isError, contractMetadataQuery.isSuccess]);

  return (
    <MetadataHeader
      isError={contractMetadataQuery.isError || wasError}
      isLoaded={contractMetadataQuery.isSuccess}
      data={contractMetadataQuery.data}
      chain={chain}
      address={contractAddress}
      externalLinks={latestPublished?.externalLinks}
    />
  );
};
