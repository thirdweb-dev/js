import { providers } from "ethers";

/**
 * Check if a contract exists at the given address
 *
 * @internal
 * @param address
 * @param provider
 */
export async function isContractDeployed(
  address: string,
  provider: providers.Provider,
): Promise<boolean> {
  const code = await provider.getCode(address);

  return code !== "0x" && code !== "0x0";
}
