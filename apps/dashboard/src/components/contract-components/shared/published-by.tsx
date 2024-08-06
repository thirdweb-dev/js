import { useEVMContractInfo } from "@3rdweb-sdk/react";
import {
  useEns,
  usePublishedContractsFromDeploy,
} from "components/contract-components/hooks";
import { ContractCard } from "components/explore/contract-card";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";

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

  const address = useActiveAccount()?.address;

  const publishedContractToShow = useMemo(() => {
    const reversedPublishedContractsFromDeploy = [
      ...(publishedContractsFromDeploy.data || []),
    ];

    return (
      reversedPublishedContractsFromDeploy.find(
        (publishedContract) => publishedContract.publisher === address,
      ) ||
      reversedPublishedContractsFromDeploy.find(
        (publishedContract) =>
          publishedContract.publisher === THIRDWEB_DEPLOYER_ADDRESS,
      ) ||
      reversedPublishedContractsFromDeploy[
        reversedPublishedContractsFromDeploy.length - 1
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
      isBeta={(publishedContractToShow.displayName || "")
        .toLowerCase()
        .includes("beta")}
    />
  );
};
