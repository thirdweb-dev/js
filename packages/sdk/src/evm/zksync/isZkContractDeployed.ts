import { Provider } from "zksync-web3";

/**
 * Check if a contract exists at the given address
 *
 * @internal
 * @param address - The address to check
 * @param provider - The provider to use
 */
export async function isZkContractDeployed(
  address: string,
  provider: Provider,
): Promise<boolean> {
  const code = await provider.getCode(address);

  return code !== "0x" && code !== "0x0";
}
