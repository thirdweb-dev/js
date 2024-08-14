import { useEVMContractInfo } from "@3rdweb-sdk/react";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import { useActiveAccount } from "thirdweb/react";

export function useModuleContractInfo(contractAddress: string) {
  const address = useActiveAccount()?.address;
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
