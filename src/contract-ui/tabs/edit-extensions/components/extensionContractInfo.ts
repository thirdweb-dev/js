import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { useAddress } from "@thirdweb-dev/react";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";

export function useExtensionContractInfo(contractAddress: string) {
  const address = useAddress();
  const activeNetworkInfo = useEVMContractInfo();

  const publishedContractsFromDeploy = usePublishedContractsFromDeploy(
    contractAddress,
    activeNetworkInfo?.chain?.chainId,
  );

  const publishedContractToShow = useMemo(() => {
    const reversedPublishedContractsFromDeploy = [
      ...(publishedContractsFromDeploy.data || []),
    ].reverse();

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

  return publishedContractToShow as typeof publishedContractToShow | undefined;
}
