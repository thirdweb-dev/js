import { useQuery } from "@tanstack/react-query";
import { usePublishedContractsFromDeploy } from "components/contract-components/hooks";
import { THIRDWEB_DEPLOYER_ADDRESS } from "constants/addresses";
import { useMemo } from "react";
import { getContract, type ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { useActiveAccount } from "thirdweb/react";

async function getAllModuleContractInfo(
  installedModules: string[],
  contract: ThirdwebContract,
) {
  return Promise.all(
    installedModules.map(async (moduleAddress) => {
      const moduleContract = getContract({
        address: moduleAddress,
        chain: contract.chain,
        client: contract.client,
      });
      const moduleMetadata = await getCompilerMetadata(moduleContract);

      return moduleMetadata;
    }),
  );
}

export function useAllModuleContractInfo(
  installedModules: string[],
  contract: ThirdwebContract,
) {
  return useQuery({
    enabled: !!contract,
    queryFn: () => getAllModuleContractInfo(installedModules || [], contract),
    queryKey: ["all-module-contract-info", installedModules, contract],
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
