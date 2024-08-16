import { useDashboardContractMetadata } from "@3rdweb-sdk/react/hooks/useDashboardContractMetadata";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { useEffect, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { MetadataHeader } from "./metadata-header";

interface ContractMetadataProps {
  contract: ThirdwebContract;
  chain?: ChainMetadata;
}

export const ContractMetadata: React.FC<ContractMetadataProps> = ({
  contract,
  chain,
}) => {
  const [wasError, setWasError] = useState(false);
  const contractMetadataQuery = useDashboardContractMetadata(contract);
  const publishedContractsFromDeploy = usePublishedContractsFromDeploy(
    contract.address,
    contract.chain.id,
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
      address={contract.address}
      externalLinks={latestPublished?.externalLinks}
    />
  );
};
