import type { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";
import { getCreate2FactoryAddress } from "./getCreate2FactoryAddress";
import { computeDeploymentInfo } from "./computeDeploymentInfo";

/**
 *
 * @internal
 * @param provider - The provider to use
 * @param storage - The storage to use
 * @param create2Factory - The create2 factory to use
 */
export async function computeModularFactoryAddress(
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
        contractName: "CloneFactory",
      },
      clientId,
      secretKey,
    )
  ).transaction.predictedAddress;
}
