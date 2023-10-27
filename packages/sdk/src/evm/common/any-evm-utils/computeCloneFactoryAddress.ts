import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { computeDeploymentInfo } from "./computeDeploymentInfo";

/**
 *
 * @internal
 * @param provider
 * @param storage
 * @param create2Factory
 */
export async function computeCloneFactoryAddress(
  provider: providers.Provider,
  storage: ThirdwebStorage,
  create2Factory?: string,
  clientId?: string,
  secretKey?: string,
): Promise<string> {
  if (!create2Factory) {
    create2Factory = await getCreate2FactoryAddress(provider);
  }
  return (
    await computeDeploymentInfo(
      "infra",
      provider,
      storage,
      create2Factory,
      {
        contractName: "TWCloneFactory",
      },
      clientId,
      secretKey,
    )
  ).transaction.predictedAddress;
}
