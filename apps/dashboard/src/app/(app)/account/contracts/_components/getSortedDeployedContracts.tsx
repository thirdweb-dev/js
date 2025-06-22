import {
  getProjectContracts,
  type ProjectContract,
} from "../../../../../@/api/getProjectContracts";
import { fetchChainWithLocalOverrides } from "../../../../../@/utils/fetchChainWithLocalOverrides";

export async function getSortedDeployedContracts(params: {
  onlyMainnet?: boolean;
  teamId: string;
  projectId: string;
  authToken: string;
  deploymentType: string | undefined;
}) {
  const contracts = await getProjectContracts({
    authToken: params.authToken,
    deploymentType: params.deploymentType,
    projectId: params.projectId,
    teamId: params.teamId,
  });

  const chainIds = Array.from(new Set(contracts.map((c) => c.chainId)));
  const chains = (
    await Promise.allSettled(
      chainIds.map((chainId) =>
        fetchChainWithLocalOverrides(chainId.toString()),
      ),
    )
  )
    .filter((c) => c.status === "fulfilled")
    .map((c) => c.value)
    .filter((c) => c !== null);

  const mainnetContracts: ProjectContract[] = [];
  const testnetContracts: ProjectContract[] = [];

  for (const contract of contracts) {
    const chain = chains.find(
      (chain) => contract.chainId === chain.chainId.toString(),
    );
    if (chain && chain.status !== "deprecated") {
      if (chain.testnet) {
        testnetContracts.push(contract);
      } else {
        mainnetContracts.push(contract);
      }
    }
  }

  mainnetContracts.sort((a, b) => Number(a.chainId) - Number(b.chainId));

  if (params.onlyMainnet) {
    return mainnetContracts;
  }

  testnetContracts.sort((a, b) => Number(a.chainId) - Number(b.chainId));

  return [...mainnetContracts, ...testnetContracts];
}
