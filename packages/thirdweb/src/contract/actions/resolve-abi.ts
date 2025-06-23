import { type Abi, formatAbi, parseAbi } from "abitype";
import { sepolia } from "viem/chains";
import { download } from "../../storage/download.js";
import { getClientFetch } from "../../utils/fetch.js";
import { withCache } from "../../utils/promise/withCache.js";
import { getContract, type ThirdwebContract } from "../contract.js";

/**
 * Resolves the ABI (Application Binary Interface) for a given contract.
 * If the ABI is already cached, it returns the cached value.
 * Otherwise, it tries to resolve the ABI from the contract's API.
 * If that fails, it resolves the ABI from the contract's bytecode.
 * @param contract The contract for which to resolve the ABI.
 * @param contractApiBaseUrl The base URL of the contract API. Defaults to "https://contract.thirdweb.com/abi".
 * @returns A promise that resolves to the ABI of the contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { resolveContractAbi } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 * const client = createThirdwebClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: ethereum,
 * });
 * const abi = await resolveContractAbi(myContract);
 * ```
 * @contract
 */
export function resolveContractAbi<abi extends Abi>(
  contract: ThirdwebContract<abi>,
  contractApiBaseUrl = "https://contract.thirdweb.com/abi",
): Promise<abi> {
  return withCache(
    async () => {
      // if the contract already HAS a user defined we always use that!
      if (contract.abi) {
        return contract.abi as abi;
      }

      // for local chains, we need to resolve the composite abi from bytecode
      if (
        contract.chain.id === 31337 ||
        contract.chain.id === 1337 ||
        contract.chain.id === sepolia.id // FIXME remove this once contract API handles 7702 delegation
      ) {
        return (await resolveCompositeAbi(contract as ThirdwebContract)) as abi;
      }

      // try to get it from the api
      try {
        return (await resolveAbiFromContractApi(
          contract,
          contractApiBaseUrl,
        )) as abi;
      } catch {
        // if that fails, try to resolve it from the bytecode
        return (await resolveCompositeAbi(contract as ThirdwebContract)) as abi;
      }
    },
    {
      cacheKey: `${contract.chain.id}-${contract.address}`,
      cacheTime: 1000 * 60 * 60 * 1, // 1 hour
    },
  );
}

/**
 * Resolves the ABI (Application Binary Interface) for a contract from the contract API.
 * @param contract The ThirdwebContract instance representing the contract.
 * @param contractApiBaseUrl The base URL of the contract API. Defaults to "https://contract.thirdweb.com/abi".
 * @returns A promise that resolves to the ABI of the contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { resolveAbiFromContractApi } from "thirdweb/contract"
 * import { ethereum } from "thirdweb/chains";
 * const client = createThirdwebClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: ethereum,
 * });
 * const abi = await resolveAbiFromContractApi(myContract);
 * ```
 * @contract
 */
export async function resolveAbiFromContractApi(
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any contract type
  contract: ThirdwebContract<any>,
  contractApiBaseUrl = "https://contract.thirdweb.com/abi",
): Promise<Abi> {
  const response = await getClientFetch(contract.client)(
    `${contractApiBaseUrl}/${contract.chain.id}/${contract.address}`,
  );
  const json = await response.json();
  if (!json || json.error) {
    throw new Error(
      `Failed to resolve ABI from contract API. ${json.error || ""}`,
    );
  }
  return json;
}

/**
 * Resolves the ABI (Application Binary Interface) from the bytecode of a contract.
 * @param contract The ThirdwebContract instance.
 * @returns The resolved ABI as a generic type.
 * @throws Error if no IPFS URI is found in the bytecode.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { resolveAbiFromBytecode } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 * const client = createThirdwebClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: ethereum,
 * });
 * const abi = await resolveAbiFromBytecode(myContract);
 * ```
 * @contract
 */
export async function resolveAbiFromBytecode(
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any contract type
  contract: ThirdwebContract<any>,
): Promise<Abi> {
  const [{ resolveImplementation }, { extractIPFSUri }] = await Promise.all([
    import("../../utils/bytecode/resolveImplementation.js"),
    import("../../utils/bytecode/extractIPFS.js"),
  ]);
  const { bytecode } = await resolveImplementation(contract);
  if (bytecode === "0x") {
    const { id, name } = contract.chain;
    throw new Error(
      `Failed to load contract bytecode. Make sure the contract [${
        contract.address
      }] exists on the chain [${name || "Unknown Chain"} (chain id: ${id})]`,
    );
  }
  const ipfsUri = extractIPFSUri(bytecode);
  if (!ipfsUri) {
    // just early exit if we can't find an IPFS URI
    return [];
  }
  try {
    const res = await download({ client: contract.client, uri: ipfsUri });
    const json = await res.json();
    // ABI is at `json.output.abi`
    return json.output.abi;
  } catch {
    // if we can't resolve the ABI from the IPFS URI, return an empty array
    return [];
  }
}

const PLUGINS_ABI = {
  inputs: [],
  name: "getAllPlugins",
  outputs: [
    {
      components: [
        {
          internalType: "bytes4",
          name: "functionSelector",
          type: "bytes4",
        },
        {
          internalType: "string",
          name: "functionSignature",
          type: "string",
        },
        {
          internalType: "address",
          name: "pluginAddress",
          type: "address",
        },
      ],
      internalType: "struct IPluginMap.Plugin[]",
      name: "registered",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

const BASE_ROUTER_ABI = {
  inputs: [],
  name: "getAllExtensions",
  outputs: [
    {
      components: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "metadataURI",
              type: "string",
            },
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          internalType: "struct IExtension.ExtensionMetadata",
          name: "metadata",
          type: "tuple",
        },
        {
          components: [
            {
              internalType: "bytes4",
              name: "functionSelector",
              type: "bytes4",
            },
            {
              internalType: "string",
              name: "functionSignature",
              type: "string",
            },
          ],
          internalType: "struct IExtension.ExtensionFunction[]",
          name: "functions",
          type: "tuple[]",
        },
      ],
      internalType: "struct IExtension.Extension[]",
      name: "allExtensions",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

const DIAMOND_ABI = {
  inputs: [],
  name: "facets",
  outputs: [
    {
      components: [
        {
          internalType: "address",
          name: "facetAddress",
          type: "address",
        },
        {
          internalType: "bytes4[]",
          name: "functionSelectors",
          type: "bytes4[]",
        },
      ],
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

/**
 * Resolves the ABI for a contract based on its bytecode.
 * If the contract follows the plugin-pattern or dynamic pattern, it resolves the ABIs for the plugins and merges them with the root ABI.
 * If the contract follows the base router pattern, it resolves the ABIs for the plugins and merges them with the root ABI.
 * If the contract follows the diamond pattern, it resolves the ABIs for the facets and merges them with the root ABI.
 * @param contract The contract for which to resolve the ABI.
 * @param rootAbi The root ABI to use for the contract. If not provided, it resolves the ABI from the contract's bytecode.
 * @param resolveSubAbi A function to resolve the ABI for a sub-contract. If not provided, it uses the default ABI resolution logic.
 * @returns The resolved ABI for the contract.
 * @example
 * ```ts
 * import { createThirdwebClient, getContract } from "thirdweb";
 * import { resolveCompositeAbiFromBytecode } from "thirdweb/contract";
 * import { ethereum } from "thirdweb/chains";
 * const client = createThirdwebClient({ clientId: "..." });
 * const myContract = getContract({
 *  client,
 *  address: "...",
 *  chain: ethereum,
 * });
 * const abi = await resolveCompositeAbiFromBytecode(myContract);
 * ```
 * @contract
 */
export async function resolveCompositeAbi(
  contract: ThirdwebContract,
  rootAbi?: Abi,
  resolveSubAbi?: (contract: ThirdwebContract) => Promise<Abi>,
) {
  const [
    rootAbi_,
    pluginPatternAddresses,
    baseRouterAddresses,
    modularExtensionAddresses,
    diamondFacetAddresses,
  ] = await Promise.all([
    rootAbi ? rootAbi : resolveAbiFromBytecode(contract),
    // check these all at the same time
    resolvePluginPatternAddresses(contract),
    resolveBaseRouterAddresses(contract),
    resolveModularModuleAddresses(contract),
    resolveDiamondFacetAddresses(contract),
  ]);

  const mergedPlugins = [
    ...new Set([
      ...pluginPatternAddresses,
      ...baseRouterAddresses,
      ...modularExtensionAddresses,
      ...diamondFacetAddresses,
    ]),
  ];

  // no plugins
  if (!mergedPlugins.length) {
    return rootAbi_;
  }
  // get all the abis for the plugins
  const pluginAbis = await getAbisForPlugins({
    contract,
    plugins: mergedPlugins,
    resolveSubAbi,
  });

  // join them together
  return joinAbis({ pluginAbis, rootAbi: rootAbi_ });
}

async function resolvePluginPatternAddresses(
  contract: ThirdwebContract,
): Promise<string[]> {
  try {
    const { readContract } = await import("../../transaction/read-contract.js");
    const pluginMap = await readContract({
      contract,
      method: PLUGINS_ABI,
    });
    // if there are no plugins, return the root ABI
    if (!pluginMap.length) {
      return [];
    }
    // get all the plugin addresses
    return [...new Set(pluginMap.map((item) => item.pluginAddress))];
  } catch {
    // no-op, expected because not everything supports this
  }
  return [];
}

async function resolveBaseRouterAddresses(
  contract: ThirdwebContract,
): Promise<string[]> {
  try {
    const { readContract } = await import("../../transaction/read-contract.js");
    const pluginMap = await readContract({
      contract,
      method: BASE_ROUTER_ABI,
    });
    // if there are no plugins, return the root ABI
    if (!pluginMap.length) {
      return [];
    }
    // get all the plugin addresses
    return [...new Set(pluginMap.map((item) => item.metadata.implementation))];
  } catch {
    // no-op, expected because not everything supports this
  }
  return [];
}

async function resolveModularModuleAddresses(
  contract: ThirdwebContract,
): Promise<string[]> {
  try {
    const { getInstalledModules } = await import(
      "../../extensions/modules/__generated__/IModularCore/read/getInstalledModules.js"
    );
    const modules = await getInstalledModules({ contract });
    // if there are no plugins, return the root ABI
    if (!modules.length) {
      return [];
    }
    // get all the plugin addresses
    return [...new Set(modules.map((item) => item.implementation))];
  } catch {
    // no-op, expected because not everything supports this
  }
  return [];
}

async function resolveDiamondFacetAddresses(
  contract: ThirdwebContract,
): Promise<string[]> {
  try {
    const { readContract } = await import("../../transaction/read-contract.js");
    const facets = await readContract({ contract, method: DIAMOND_ABI });
    // if there are no facets, return the root ABI
    if (!facets.length) {
      return [];
    }
    // get all the plugin addresses
    return facets.map((item) => item.facetAddress);
  } catch {
    // no-op, expected because not everything supports this
  }
  return [];
}

type GetAbisForPluginsOptions = {
  // biome-ignore lint/suspicious/noExplicitAny: library function that accepts any contract type
  contract: ThirdwebContract<any>;
  plugins: string[];
  resolveSubAbi?: (contract: ThirdwebContract) => Promise<Abi>;
};

async function getAbisForPlugins(
  options: GetAbisForPluginsOptions,
): Promise<Abi[]> {
  return Promise.all(
    options.plugins.map((pluginAddress) => {
      const newContract = getContract({
        ...options.contract,
        address: pluginAddress,
      });
      // if we have a method passed in that tells us how to resove the sub-api, use that
      if (options.resolveSubAbi) {
        return options.resolveSubAbi(newContract);
      }
      // otherwise default logic
      return resolveAbiFromBytecode(newContract);
    }),
  );
}

type JoinAbisOptions = {
  pluginAbis: Abi[];
  rootAbi?: Abi;
};

function joinAbis(options: JoinAbisOptions): Abi {
  let mergedPlugins: Abi = options.pluginAbis
    .flat()
    .filter((item) => item.type !== "constructor");

  if (options.rootAbi) {
    mergedPlugins = [...options.rootAbi, ...mergedPlugins]
      .filter((item) => item.type !== "fallback" && item.type !== "receive")
      .filter(Boolean);
  }

  // unique by formatting every abi and then throwing them in a set
  // TODO: this may not be super efficient...
  const humanReadableAbi = [...new Set(formatAbi(mergedPlugins))];

  // finally parse it back out
  return parseAbi(humanReadableAbi);
}
