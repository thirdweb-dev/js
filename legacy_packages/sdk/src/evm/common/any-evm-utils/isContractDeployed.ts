import { providers } from "ethers";

/**
 * Check if a contract exists at the given address
 * @deploy
 * @public
 * @param address - The address to check
 * @param provider - The provider to use
 */
export async function isContractDeployed(
  address: string,
  provider: providers.Provider,
): Promise<boolean> {
  const code = await provider.getCode(address);

  return code !== "0x" && code !== "0x0";
}
