import { type Abi, parseAbi, formatAbi } from "abitype";
import { getClientFetch } from "../../utils/fetch.js";
import { getBytecode } from "./get-bytecode.js";
import { download } from "../../storage/download.js";
import { extractIPFSUri } from "../../utils/bytecode/extractIPFS.js";
import type { ThirdwebContract } from "../contract.js";

const ABI_RESOLUTION_CACHE = new WeakMap<ThirdwebContract<Abi>, Promise<Abi>>();

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
 */
export function resolveContractAbi<abi extends Abi>(
  contract: ThirdwebContract<abi>,
  contractApiBaseUrl = "https://contract.thirdweb.com/abi",
): Promise<abi> {
  if (ABI_RESOLUTION_CACHE.has(contract)) {
    return ABI_RESOLUTION_CACHE.get(contract) as Promise<abi>;
  }

  const prom = (async () => {
    // if the contract already HAS a user defined we always use that!
    if (contract.abi) {
      return contract.abi as abi;
    }
    // try to get it from the api
    try {
      return await resolveAbiFromContractApi(contract, contractApiBaseUrl);
    } catch (e) {
      // if that fails, try to resolve it from the bytecode
      return await resolveCompositeAbi(contract as ThirdwebContract<any>);
    }
  })();
  ABI_RESOLUTION_CACHE.set(contract, prom);
  return prom as Promise<abi>;
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
 */
export async function resolveAbiFromContractApi(
  contract: ThirdwebContract<any>,
  contractApiBaseUrl = "https://contract.thirdweb.com/abi",
): Promise<Abi> {
  const response = await getClientFetch(contract.client)(
    `${contractApiBaseUrl}/${contract.chain.id}/${contract.address}`,
  );
  const json = await response.json();
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
 */
export async function resolveAbiFromBytecode(
  contract: ThirdwebContract<any>,
): Promise<Abi> {
  const bytecode = await getBytecode(contract);
  const ipfsUri = extractIPFSUri(bytecode);
  if (!ipfsUri) {
    // just early exit if we can't find an IPFS URI
    return [];
  }
  try {
    const res = await download({ uri: ipfsUri, client: contract.client });
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
    diamondFacetAddresses,
  ] = await Promise.all([
    rootAbi ? rootAbi : resolveAbiFromBytecode(contract),
    // check these all at the same time
    resolvePluginPatternAddresses(contract),
    resolveBaseRouterAddresses(contract),
    resolveDiamondFacetAddresses(contract),
  ]);

  const mergedPlugins = [
    ...new Set([
      ...pluginPatternAddresses,
      ...baseRouterAddresses,
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
  return joinAbis({ rootAbi: rootAbi_, pluginAbis });
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
  contract: ThirdwebContract<any>;
  plugins: string[];
  resolveSubAbi?: (contract: ThirdwebContract) => Promise<Abi>;
};

async function getAbisForPlugins(
  options: GetAbisForPluginsOptions,
): Promise<Abi[]> {
  return Promise.all(
    options.plugins.map((pluginAddress) => {
      const newContract = {
        ...options.contract,
        address: pluginAddress,
      };
      // if we have a method passed in that tells us how to resove the sub-api, use that
      if (options.resolveSubAbi) {
        return options.resolveSubAbi(newContract);
      } else {
        // otherwise default logic
        return resolveAbiFromBytecode(newContract);
      }
    }),
  );
}

type JoinAbisOptions = {
  pluginAbis: Abi[];
  rootAbi?: Abi;
};

function joinAbis(options: JoinAbisOptions): Abi {
  let mergedPlugins = options.pluginAbis
    .flat()
    .filter((item) => item.type !== "constructor");

  if (options.rootAbi) {
    mergedPlugins = [...(options.rootAbi || []), ...mergedPlugins].filter(
      Boolean,
    );
  }

  // unique by formatting every abi and then throwing them in a set
  // TODO: this may not be super efficient...
  const humanReadableAbi = [...new Set(formatAbi(mergedPlugins))];
  // finally parse it back out
  return parseAbi(humanReadableAbi);
}
