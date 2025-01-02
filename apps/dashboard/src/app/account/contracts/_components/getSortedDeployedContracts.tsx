import { MULTICHAIN_REGISTRY_CONTRACT } from "constants/contracts";
import type { BasicContract } from "contract-ui/types/types";
import { getAllMultichainRegistry } from "../../../../dashboard-extensions/common/read/getAllMultichainRegistry";
import { fetchChain } from "../../../../utils/fetchChain";

export async function getSortedDeployedContracts(params: {
  address: string;
  onlyMainnet?: boolean;
}) {
  const contracts = await getAllMultichainRegistry({
    contract: MULTICHAIN_REGISTRY_CONTRACT,
    address: params.address,
  });

  const chainIds = Array.from(new Set(contracts.map((c) => c.chainId)));
  const chains = (
    await Promise.allSettled(
      chainIds.map((chainId) => fetchChain(chainId.toString())),
    )
  )
    .filter((c) => c.status === "fulfilled")
    .map((c) => c.value)
    .filter((c) => c !== null);

  const mainnetContracts: BasicContract[] = [];
  const testnetContracts: BasicContract[] = [];

  for (const contract of contracts) {
    const chain = chains.find((chain) => contract.chainId === chain.chainId);
    if (chain && chain.status !== "deprecated") {
      if (chain.testnet) {
        testnetContracts.push(contract);
      } else {
        mainnetContracts.push(contract);
      }
    }
  }

  mainnetContracts.sort((a, b) => a.chainId - b.chainId);

  if (params.onlyMainnet) {
    return mainnetContracts;
  }

  testnetContracts.sort((a, b) => a.chainId - b.chainId);

  return [...mainnetContracts, ...testnetContracts];
}
