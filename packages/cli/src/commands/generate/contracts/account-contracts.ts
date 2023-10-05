import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { Chain } from "@thirdweb-dev/chains";

let polygonSdk: ThirdwebSDK;
export async function getContractsForChains(
  walletAddress: string,
  chains: Chain[],
  secretKey?: string,
) {
  if (!polygonSdk) {
    polygonSdk = new ThirdwebSDK(137, { secretKey });
  }
  const rawContracts = await polygonSdk.getMultichainContractList(
    walletAddress,
    chains,
  );
  return Promise.all(
    rawContracts.map(async (contract) => {
      const [metadata, contractType] = await Promise.all([
        contract.metadata().catch(() => null),
        contract.contractType().catch(() => null),
      ]);
      return {
        address: contract.address,
        chainId: contract.chainId,
        metadata,
        contractType,
      };
    }),
  );
}
