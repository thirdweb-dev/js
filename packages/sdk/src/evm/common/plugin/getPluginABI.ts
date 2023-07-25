import { Address } from "../../schema/shared/Address";
import { Abi } from "../../schema/contracts/custom";
import { fetchContractMetadataFromAddress } from "../metadata-resolver";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { providers } from "ethers";

/**
 * @internal
 */
export async function getPluginABI(
  addresses: Address[],
  provider: providers.Provider,
  storage: ThirdwebStorage,
): Promise<Abi[]> {
  return (
    await Promise.all(
      addresses.map((address) =>
        fetchContractMetadataFromAddress(address, provider, storage).catch(
          (err) => {
            console.error(`Failed to fetch plug-in for ${address}`, err);
            return { abi: [] };
          },
        ),
      ),
    )
  ).map((metadata) => metadata.abi);
}
