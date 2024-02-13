import { isAddress } from "viem";
import { eth_getStorageAt, getRpcClient } from "../../rpc/index.js";
import { extractMinimalProxyImplementationAddress } from "./extractMnimalProxyImplementationAddress.js";
import { getBytecode } from "../../contract/actions/get-bytecode.js";
import type { ThirdwebContract } from "../../contract/contract.js";
import { readContract } from "../../transaction/read-contract.js";

// TODO: move to const exports
export const AddressZero = "0x0000000000000000000000000000000000000000";

/**
 * Resolves the implementation address and bytecode for a given contract.
 * @param contract The contract to resolve the implementation for.
 * @returns A promise that resolves to an object containing the implementation address and bytecode.
 * @example
 * ```ts
 * import { resolveImplementation } from "thirdweb";
 * const implementation = await resolveImplementation(contract);
 * ```
 */
export async function resolveImplementation(
  contract: ThirdwebContract<any>,
): Promise<{ address: string; bytecode: string }> {
  const [bytecode, beacon] = await Promise.all([
    getBytecode(contract),
    getBeaconFromStorageSlot(contract),
  ]);
  // check minimal proxy first synchronously
  const minimalProxyImplementationAddress =
    extractMinimalProxyImplementationAddress(bytecode);
  if (minimalProxyImplementationAddress) {
    return {
      address: minimalProxyImplementationAddress,
      bytecode: await getBytecode({
        ...contract,
        address: minimalProxyImplementationAddress,
      }),
    };
  }

  // check other proxy types
  if (beacon && beacon !== AddressZero) {
    // In case of a BeaconProxy, it is setup as BeaconProxy --> Beacon --> Implementation
    // Hence we replace the proxy address with Beacon address, and continue further resolving below
    contract = { ...contract, address: beacon };
  }
  const implementations = await Promise.all([
    getImplementationFromStorageSlot(contract),
    getImplementationFromContractCall(contract),
  ]);
  // this seems inefficient
  for (const implementationAddress of implementations) {
    if (
      implementationAddress &&
      isAddress(implementationAddress) &&
      implementationAddress !== AddressZero
    ) {
      return {
        address: implementationAddress,
        bytecode: await getBytecode({
          ...contract,
          address: implementationAddress,
        }),
      };
    }
  }

  return { address: contract.address, bytecode };
}

async function getBeaconFromStorageSlot(
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  /**
   * The storage slot of the Beacon as defined in EIP-1967
   * See https://eips.ethereum.org/EIPS/eip-1967#beacon-contract-address
   *
   * bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1))
   */
  const rpcRequest = getRpcClient({
    client: contract.client,
    chain: contract.chain,
  });

  try {
    const proxyStorage = await eth_getStorageAt(rpcRequest, {
      address: contract.address,
      position:
        "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
    });
    return `0x${proxyStorage.slice(-40)}`;
  } catch {
    return undefined;
  }
}

async function getImplementationFromStorageSlot(
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  const rpcRequest = getRpcClient({
    client: contract.client,
    chain: contract.chain,
  });

  try {
    const proxyStorage = await eth_getStorageAt(rpcRequest, {
      address: contract.address,
      position:
        "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
    });
    return `0x${proxyStorage.slice(-40)}`;
  } catch {
    return undefined;
  }
}

const UPGRADEABLE_PROXY_ABI = {
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
} as const;

async function getImplementationFromContractCall(
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  try {
    return await readContract({ contract, method: UPGRADEABLE_PROXY_ABI });
  } catch {
    return undefined;
  }
}
