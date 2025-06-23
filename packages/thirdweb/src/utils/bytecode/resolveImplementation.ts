import { getBytecode } from "../../contract/actions/get-bytecode.js";
import { getContract, type ThirdwebContract } from "../../contract/contract.js";
import { eth_getStorageAt } from "../../rpc/actions/eth_getStorageAt.js";
import { getRpcClient } from "../../rpc/rpc.js";
import { readContract } from "../../transaction/read-contract.js";
import { isAddress } from "../address.js";
import type { Hex } from "../encoding/hex.js";
import { extractMinimalProxyImplementationAddress } from "./extractMinimalProxyImplementationAddress.js";

// TODO: move to const exports
const AddressZero = "0x0000000000000000000000000000000000000000";
const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Resolves the implementation address and bytecode for a given proxy contract.
 * @param contract The contract to resolve the implementation for.
 * @returns A promise that resolves to an object containing the implementation address and bytecode.
 * @example
 * ```ts
 * import { resolveImplementation } from "thirdweb/utils";
 * const implementation = await resolveImplementation(contract);
 * ```
 * @contract
 */
export async function resolveImplementation(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  contract: ThirdwebContract<any>,
): Promise<{ address: string; bytecode: Hex }> {
  const [originalBytecode, beacon] = await Promise.all([
    getBytecode(contract),
    getBeaconFromStorageSlot(contract),
  ]);
  // check minimal proxy first synchronously
  const minimalProxyImplementationAddress =
    extractMinimalProxyImplementationAddress(originalBytecode);
  if (minimalProxyImplementationAddress) {
    return {
      address: minimalProxyImplementationAddress,
      bytecode: await getBytecode(
        getContract({
          ...contract,
          address: minimalProxyImplementationAddress,
        }),
      ),
    };
  }

  // check other proxy types
  let implementationAddress: string | undefined;

  if (beacon && beacon !== AddressZero) {
    // In case of a BeaconProxy, it is setup as BeaconProxy --> Beacon --> Implementation
    // Hence we replace the proxy address with Beacon address, and continue further resolving below
    contract = getContract({
      ...contract,
      address: beacon,
    });

    implementationAddress = await getImplementationFromContractCall(contract);
  } else {
    implementationAddress = await getImplementationFromStorageSlot(contract);
  }

  if (
    implementationAddress &&
    isAddress(implementationAddress) &&
    implementationAddress !== AddressZero
  ) {
    const implementationBytecode = await getBytecode({
      ...contract,
      address: implementationAddress,
    });
    // return the original contract bytecode if the implementation bytecode is empty
    if (implementationBytecode === "0x") {
      return {
        address: contract.address,
        bytecode: originalBytecode,
      };
    }

    return {
      address: implementationAddress,
      bytecode: implementationBytecode,
    };
  }

  return { address: contract.address, bytecode: originalBytecode };
}

async function getBeaconFromStorageSlot(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  /**
   * The storage slot of the Beacon as defined in EIP-1967
   * See https://eips.ethereum.org/EIPS/eip-1967#beacon-contract-address
   *
   * bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1))
   */
  const rpcRequest = getRpcClient({
    chain: contract.chain,
    client: contract.client,
  });

  try {
    const proxyStorage = await eth_getStorageAt(rpcRequest, {
      address: contract.address,
      position:
        "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
    });
    if (proxyStorage.length >= 40) {
      return `0x${proxyStorage.slice(-40)}`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

async function getImplementationFromStorageSlot(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  const rpcRequest = getRpcClient({
    chain: contract.chain,
    client: contract.client,
  });

  try {
    const proxyStoragePromises = [
      eth_getStorageAt(rpcRequest, {
        address: contract.address,
        position:
          "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
      }),
      eth_getStorageAt(rpcRequest, {
        address: contract.address,
        position:
          // keccak256("matic.network.proxy.implementation") - used in polygon USDT proxy: https://polygonscan.com/address/0xc2132d05d31c914a87c6611c10748aeb04b58e8f#code
          "0xbaab7dbf64751104133af04abc7d9979f0fda3b059a322a8333f533d3f32bf7f",
      }),
      eth_getStorageAt(rpcRequest, {
        address: contract.address,
        position:
          // keccak256("org.zeppelinos.proxy.implementation") - e.g. base USDC proxy: https://basescan.org/address/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913#code
          "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3",
      }),
    ];

    const proxyStorages = await Promise.all(proxyStoragePromises);
    const proxyStorage = proxyStorages.find(
      (storage) => storage !== ZERO_BYTES32,
    );

    return proxyStorage ? `0x${proxyStorage.slice(-40)}` : AddressZero;
  } catch {
    return undefined;
  }
}

const UPGRADEABLE_PROXY_ABI = {
  inputs: [],
  name: "implementation",
  outputs: [
    {
      internalType: "address",
      name: "",
      type: "address",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

async function getImplementationFromContractCall(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
  contract: ThirdwebContract<any>,
): Promise<string | undefined> {
  try {
    return await readContract({ contract, method: UPGRADEABLE_PROXY_ABI });
  } catch {
    return undefined;
  }
}
