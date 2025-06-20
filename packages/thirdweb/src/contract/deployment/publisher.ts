import { polygon } from "../../chains/chain-definitions/polygon.js";
import type { ThirdwebClient } from "../../client/client.js";
import { download } from "../../storage/download.js";
import { readContract } from "../../transaction/read-contract.js";
import {
  type FetchDeployMetadataResult,
  fetchDeployMetadata,
} from "../../utils/any-evm/deploy-metadata.js";
import { extractIPFSUri } from "../../utils/bytecode/extractIPFS.js";
import { resolveImplementation } from "../../utils/bytecode/resolveImplementation.js";
import { withCache } from "../../utils/promise/withCache.js";

import { getContract, type ThirdwebContract } from "../contract.js";

export const CONTRACT_PUBLISHER_ADDRESS =
  "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808"; // Polygon only
const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

/**
 * @internal
 */
export async function fetchPublishedContractMetadata(options: {
  client: ThirdwebClient;
  contractId: string;
  publisher?: string;
  version?: string;
}): Promise<FetchDeployMetadataResult> {
  const cacheKey = `${options.contractId}-${options.publisher}-${options.version}`;
  return withCache(
    async () => {
      const publishedContract = await fetchPublishedContract({
        client: options.client,
        contractId: options.contractId,
        publisherAddress: options.publisher || THIRDWEB_DEPLOYER,
        version: options.version,
      });
      if (!publishedContract.publishMetadataUri) {
        throw new Error(
          `No published metadata URI found for ${options.contractId}`,
        );
      }
      const data = await fetchDeployMetadata({
        client: options.client,
        uri: publishedContract.publishMetadataUri,
      });
      return data;
    },
    { cacheKey, cacheTime: 1000 * 60 * 60 },
  );
}

// TODO: clean this up
/**
 *
 * @param contract
 * @example
 * @internal
 */
export async function fetchDeployBytecodeFromPublishedContractMetadata(
  contract: ThirdwebContract,
): Promise<string | undefined> {
  const { bytecode } = await resolveImplementation(contract);
  const compilerMetaUri = extractIPFSUri(bytecode);
  // early return if no compiler metadata
  if (!compilerMetaUri) {
    return undefined;
  }
  const contractPublisher = getContract({
    address: CONTRACT_PUBLISHER_ADDRESS,
    chain: polygon,
    client: contract.client,
  });
  const publishedMetadataUri = await readContract({
    contract: contractPublisher,
    method:
      "function getPublishedUriFromCompilerUri(string) returns (string[])",
    params: [compilerMetaUri],
  });
  if (publishedMetadataUri.length === 0) {
    throw Error(
      `Could not resolve published metadata URI from ${compilerMetaUri}`,
    );
  }

  const pubmeta = await Promise.all(
    publishedMetadataUri
      .filter((uri) => uri.length > 0)
      .map((uri) =>
        download({ client: contract.client, uri })
          .then((res) => res.text())
          .then(JSON.parse),
      ),
  );

  return pubmeta.length > 0
    ? await (
        await download({ client: contract.client, uri: pubmeta[0].bytecodeUri })
      ).text()
    : undefined;
}

const GET_PUBLISHED_CONTRACT_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "_publisher",
      type: "address",
    },
    {
      internalType: "string",
      name: "_contractId",
      type: "string",
    },
  ],
  name: "getPublishedContract",
  outputs: [
    {
      components: [
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "publishTimestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      internalType: "struct IContractPublisher.CustomContractInstance",
      name: "published",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

const GET_PUBLISHED_CONTRACT_VERSIONS_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "_publisher",
      type: "address",
    },
    {
      internalType: "string",
      name: "_contractId",
      type: "string",
    },
  ],
  name: "getPublishedContractVersions",
  outputs: [
    {
      components: [
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "publishTimestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      internalType: "struct IContractPublisher.CustomContractInstance[]",
      name: "published",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

/**
 * @contract
 */
type FetchPublishedContractOptions = {
  publisherAddress: string;
  contractId: string;
  version?: string;
  client: ThirdwebClient;
};

/**
 * Fetches the published contract based on the provided options.
 * @param options - The options for fetching the published contract.
 * @returns The published contract.
 * @throws Error if the contract version or published contract is not found.
 * @example
 * ```ts
 * const publishedContract = await fetchPublishedContract({
 *  publisherAddress: "0x1234",
 *  contractName: "MyContract",
 *  version: "1.0.0",
 *  client: client,
 * });
 * ```
 * @contract
 */
export async function fetchPublishedContract(
  options: FetchPublishedContractOptions,
) {
  const contractPublisher = getContract({
    address: CONTRACT_PUBLISHER_ADDRESS,
    chain: polygon,
    client: options.client,
  });
  if (!options.version || options.version === "latest") {
    return await readContract({
      contract: contractPublisher,
      method: GET_PUBLISHED_CONTRACT_ABI,
      params: [options.publisherAddress, options.contractId],
    });
  }
  const allVersions = await readContract({
    contract: contractPublisher,
    method: GET_PUBLISHED_CONTRACT_VERSIONS_ABI,
    params: [options.publisherAddress, options.contractId],
  });

  const versionsMetadata = (
    await Promise.all(
      allVersions.map((version) => {
        return download({
          client: options.client,
          uri: version.publishMetadataUri,
        }).then((res) => res.json());
      }),
    )
  ).map((item, index) => {
    return {
      name: allVersions[index]?.contractId,
      publishedMetadata: item,
      publishedTimestamp: allVersions[index]?.publishTimestamp,
    };
  });

  // find the version that matches the version string
  const versionMatch = versionsMetadata.find(
    (metadata) =>
      // Will probably only need metadata.publishedMetadata.version unless its an outdated contract
      metadata.publishedMetadata.extendedMetadata?.version ===
        options.version ||
      metadata.publishedMetadata.version === options.version,
  );
  if (!versionMatch) {
    throw Error("Contract version not found");
  }
  // match the version back to the contract based on the published timestamp
  const publishedContract = allVersions.find(
    (c) => c.publishTimestamp === versionMatch.publishedTimestamp,
  );
  if (!publishedContract) {
    throw Error(
      `No published contract found for ${options.contractId} at version by '${options.publisherAddress}'`,
    );
  }
  return publishedContract;
}
