import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { useAddress } from "@thirdweb-dev/react";
import {
  useEns,
  usePublishedContractsFromDeploy,
} from "components/contract-components/hooks";
import { ContractCard } from "components/explore/contract-card";
import { useMemo } from "react";

interface PublishedByProps {
  contractAddress: string;
}

export const PublishedBy: React.FC<PublishedByProps> = ({
  contractAddress,
}) => {
  const contractEnsQuery = useEns(contractAddress);
  const activeNetworkInfo = useEVMContractInfo();

  const publishedContractsFromDeploy = usePublishedContractsFromDeploy(
    contractEnsQuery.data?.address || undefined,
    activeNetworkInfo?.chain?.chainId,
  );

  const address = useAddress();

  const publishedContractToShow = useMemo(() => {
    return (
      publishedContractsFromDeploy.data?.find(
        (publishedContract) => publishedContract.publisher === address,
      ) ||
      publishedContractsFromDeploy.data?.[
        publishedContractsFromDeploy.data.length - 1
      ] ||
      undefined
    );
  }, [publishedContractsFromDeploy.data, address]);

  const publisherEnsQuery = useEns(publishedContractToShow?.publisher);
  const publisherAddress =
    publisherEnsQuery.data?.ensName || publisherEnsQuery.data?.address;

  if (!publishedContractToShow || !publisherAddress) {
    return null;
  }

  return (
    <ContractCard
      contractId={publishedContractToShow.name}
      publisher={publisherAddress}
      version={publishedContractToShow.version}
    />
  );
};
