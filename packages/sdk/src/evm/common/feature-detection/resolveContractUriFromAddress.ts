import { BigNumber, providers, constants } from "ethers";
import { isAddress } from "ethers/lib/utils";
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
    const implementationAddress =
      extractMinimalProxyImplementationAddress(bytecode);
    if (implementationAddress) {
      return await resolveContractUriFromAddress(
        implementationAddress,
        provider,
      );
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
      isAddress(implementationAddress) &&
      implementationAddress !== constants.AddressZero
    ) {
      return await resolveContractUriFromAddress(
        implementationAddress,
        provider,
      );
    }
  } catch (e) {
    // ignore
  }
  // TODO support other types of proxies
  return await extractIPFSHashFromBytecode(bytecode);
}
