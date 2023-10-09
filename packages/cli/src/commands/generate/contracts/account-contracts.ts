import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { Chain } from "@thirdweb-dev/chains";
import { logger } from "../../../utils/logger";

let polygonSdk: ThirdwebSDK;
export async function getContractsForChains(
  walletAddress: string,
  chains: Chain[],
  secretKey?: string,
) {
  if (!polygonSdk) {
    // fake clientId for cases where we don't have a secret key (which will be used with auth token anyways and thus not get used)
    polygonSdk = new ThirdwebSDK(137, secretKey ? { secretKey } : {});
  }
  return await polygonSdk
    .getMultichainContractList(walletAddress, chains)
    .catch((err) => {
      logger.debug("Failed to get contracts for chains", err);
      return [];
    });
}

export async function enrichContractMetadata(
  contracts: Awaited<ReturnType<typeof getContractsForChains>>,
) {
  return await Promise.all(
    contracts.map((contract) =>
      Promise.all([
        contract.metadata().catch(() => null),
        contract.abi().catch(() => null),
        contract.contractType().catch(() => null),
      ]).then(([metadata, abi, contractType]) => ({
        ...contract,
        abi,
        contractType,
        metadata,
      })),
    ),
  );
}
