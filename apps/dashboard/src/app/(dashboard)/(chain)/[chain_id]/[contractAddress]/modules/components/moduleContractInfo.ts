import { useQuery } from "@tanstack/react-query";
import { fetchPublishedContractsFromDeploy } from "components/contract-components/fetchPublishedContractsFromDeploy";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import { type ThirdwebContract, getContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

export async function getAllModuleContractInfo(
  activeAccountAddress: string,
  installedModules: string[],
  contract: ThirdwebContract,
) {
  if (!activeAccountAddress) {
    return [];
  }

  return Promise.all(
    installedModules.map(async (moduleAddress) => {
      const publishedContractsFromDeploy =
        await fetchPublishedContractsFromDeploy({
          contract: getContract({
            address: moduleAddress,
            chain: contract.chain,
            client: contract.client,
          }),
          client: contract.client,
        });

      const reversedPublishedContractsFromDeploy = [
        ...(publishedContractsFromDeploy || []),
      ].reverse();

      const publishedContractToShow =
        reversedPublishedContractsFromDeploy.find(
          (publishedContract) =>
            publishedContract.publisher === activeAccountAddress,
        ) ||
        reversedPublishedContractsFromDeploy.find(
          (publishedContract) =>
            publishedContract.publisher === THIRDWEB_DEPLOYER_ADDRESS,
        ) ||
        reversedPublishedContractsFromDeploy[
          reversedPublishedContractsFromDeploy.length - 1
        ] ||
        undefined;

      return publishedContractToShow as
        | typeof publishedContractToShow
        | undefined;
    }),
  );
}

export function useAllModuleContractInfo(
  installedModules: string[],
  contract: ThirdwebContract,
) {
  const address = useActiveAccount()?.address;

  return useQuery({
    queryKey: ["all-module-contract-info", installedModules, contract, address],
    queryFn: () =>
      getAllModuleContractInfo(address || "", installedModules || [], contract),
    enabled: !!address && !!contract,
  });
}

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
