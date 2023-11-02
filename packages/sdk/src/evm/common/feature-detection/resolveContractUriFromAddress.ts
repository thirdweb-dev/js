import { BigNumber, providers, constants, utils, Contract } from "ethers";
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
  const bytecode = await fetchBytecode(address, provider);

  // check minimal proxy first synchronously
  const minimalProxyImplementationAddress =
    extractMinimalProxyImplementationAddress(bytecode);
  if (minimalProxyImplementationAddress) {
    return {
      address: minimalProxyImplementationAddress,
      bytecode: await fetchBytecode(
        minimalProxyImplementationAddress,
        provider,
      ),
    };
  }

  // check other proxy types
  const impl = await Promise.all([
    getImplementationFromStorageSlot(address, provider),
    getImplementationFromContractCall(address, provider),
  ]);

  for (const implementationAddress of impl) {
    if (
      implementationAddress &&
      utils.isAddress(implementationAddress) &&
      implementationAddress !== constants.AddressZero
    ) {
      return {
        address: implementationAddress,
        bytecode: await fetchBytecode(implementationAddress, provider),
      };
    }
  }

  return { address, bytecode };
}

async function fetchBytecode(
  address: string,
  provider: providers.Provider,
): Promise<string> {
  try {
    const bytecode = await provider.getCode(address);
    if (bytecode === "0x") {
      const chain = await provider.getNetwork();
      throw new Error(
        `Contract at ${address} does not exist on chain '${chain.name}' (chainId: ${chain.chainId})`,
      );
    }
    return bytecode;
  } catch (e) {
    throw new Error(`Failed to get bytecode for address ${address}: ${e}`);
  }
}

async function getImplementationFromStorageSlot(
  address: string,
  provider: providers.Provider,
): Promise<string | undefined> {
  try {
    const proxyStorage = await provider.getStorageAt(
      address,
      BigNumber.from(
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
      ),
    );
    return `0x${proxyStorage.slice(-40)}`;
  } catch (e) {
    return undefined;
  }
}

async function getImplementationFromContractCall(
  address: string,
  provider: providers.Provider,
): Promise<string | undefined> {
  try {
    const proxy = new Contract(address, UPGRADEABLE_PROXY_ABI, provider);
    return await proxy.implementation();
  } catch (e) {
    return undefined;
  }
}

const UPGRADEABLE_PROXY_ABI = [
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        type: "address",
        name: "",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
];
