import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import type { ThirdwebContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export function useModuleContractInfo(contract: ThirdwebContract) {
  const address = useActiveAccount()?.address;

  const publishedContractsFromDeploy =
    usePublishedContractsFromDeploy(contract);

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
