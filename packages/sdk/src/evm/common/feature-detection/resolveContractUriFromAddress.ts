import { BigNumber, providers, constants, utils, Contract } from "ethers";
import { extractIPFSHashFromBytecode } from "./extractIPFSHashFromBytecode";
import { extractMinimalProxyImplementationAddress } from "./extractMinimalProxyImplementationAddress";

/**
 * @internal
 * @param address - the contract address
 * @param provider - RPC provider
 */
export async function resolveContractUriFromAddress(
  address: string,
  provider: providers.Provider,
): Promise<string | undefined> {
  const { bytecode } = await resolveImplementation(address, provider);
  return extractIPFSHashFromBytecode(bytecode);
}

/**
 * @internal
 */
export async function resolveContractUriAndBytecode(
  address: string,
  provider: providers.Provider,
): Promise<{ uri: string | undefined; bytecode: string }> {
  const { bytecode } = await resolveImplementation(address, provider);
  return { uri: extractIPFSHashFromBytecode(bytecode), bytecode };
}

/**
 * Resolve the implementation address of a proxy contract and its bytecode
 * @param address - the contract address
 * @param provider - RPC provider
 * @returns The implementation address and its bytecode
 */
export async function resolveImplementation(
  address: string,
  provider: providers.Provider,
): Promise<{ address: string; bytecode: string }> {
  const [bytecode, beacon] = await Promise.all([
    fetchBytecode(address, provider),
    getBeaconFromStorageSlot(address, provider),
  ]);

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
  if (beacon && beacon !== constants.AddressZero) {
    // In case of a BeaconProxy, it is setup as BeaconProxy --> Beacon --> Implementation
    // Hence we replace the proxy address with Beacon address, and continue further resolving below
    address = beacon;
  }
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
      try {
        const implBytecode = await fetchBytecode(
          implementationAddress,
          provider,
        );
        return {
          address: implementationAddress,
          bytecode: implBytecode,
        };
      } catch (e: any) {
        if (
          !e
            .toString()
            .includes(
              `Contract at ${implementationAddress} does not exist on chain`,
            )
        ) {
          throw new Error(e);
        }
      }
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

async function getBeaconFromStorageSlot(
  address: string,
  provider: providers.Provider,
): Promise<string | undefined> {
  /**
   * The storage slot of the Beacon as defined in EIP-1967
   * See https://eips.ethereum.org/EIPS/eip-1967#beacon-contract-address
   *
   * bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1))
   */

  try {
    const proxyStorage = await provider.getStorageAt(
      address,
      BigNumber.from(
        "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
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
