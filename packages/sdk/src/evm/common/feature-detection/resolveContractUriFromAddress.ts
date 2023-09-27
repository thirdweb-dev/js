import { BigNumber, providers, constants, utils } from "ethers";
import { extractIPFSHashFromBytecode } from "./extractIPFSHashFromBytecode";
import { extractMinimalProxyImplementationAddress } from "./extractMinimalProxyImplementationAddress";

/**
 * @internal
 * @param address
 * @param provider
 */
export async function resolveContractUriFromAddress(
  address: string,
  provider: providers.Provider,
): Promise<string | undefined> {
  const { bytecode } = await resolveImplementation(address, provider);
  return extractIPFSHashFromBytecode(bytecode);
}

export async function resolveContractUriAndBytecode(
  address: string,
  provider: providers.Provider,
): Promise<{ uri: string | undefined; bytecode: string }> {
  const { bytecode } = await resolveImplementation(address, provider);
  return { uri: extractIPFSHashFromBytecode(bytecode), bytecode };
}

/**
 * Resolve the implementation address of a proxy contract and its bytecode
 * @param address the contract address
 * @param provider RPC provider
 * @returns the implementation address and its bytecode
 */
export async function resolveImplementation(
  address: string,
  provider: providers.Provider,
): Promise<{ address: string; bytecode: string }> {
  let bytecode;
  try {
    bytecode = await provider.getCode(address);
  } catch (e) {
    throw new Error(`Failed to get bytecode for address ${address}: ${e}`);
  }

  if (bytecode === "0x") {
    const chain = await provider.getNetwork();
    throw new Error(
      `Contract at ${address} does not exist on chain '${chain.name}' (chainId: ${chain.chainId})`,
    );
  }

  try {
    // TODO support other types of proxies
    const implementationAddress =
      extractMinimalProxyImplementationAddress(bytecode);
    if (implementationAddress) {
      return await resolveImplementation(implementationAddress, provider);
    }
  } catch (e) {
    // ignore
  }

  // EIP-1967 proxy storage slots - https://eips.ethereum.org/EIPS/eip-1967
  try {
    const proxyStorage = await provider.getStorageAt(
      address,
      BigNumber.from(
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
      ),
    );
    const implementationAddress = `0x${proxyStorage.slice(-40)}`;
    if (
      utils.isAddress(implementationAddress) &&
      implementationAddress !== constants.AddressZero
    ) {
      return await resolveImplementation(implementationAddress, provider);
    }
  } catch (e) {
    // ignore
  }
  if (!bytecode) {
    throw new Error(`Error fetching bytecode for ${address}`);
  }
  return { address, bytecode };
}
