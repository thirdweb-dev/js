import { encodePacked, maxUint256 } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import {
  ADDRESS_ZERO,
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../constants/addresses.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { setContractURI } from "../../exports/extensions/common.js";
import { getContractMetadata } from "../../extensions/common/read/getContractMetadata.js";
import { setClaimConditions as setCC721 } from "../../extensions/erc721/__generated__/IDrop/write/setClaimConditions.js";
import {
  type SetClaimConditionsParams as GeneratedParams,
  setClaimConditions as setCC1155,
} from "../../extensions/erc1155/__generated__/IDrop1155/write/setClaimConditions.js";
import { MerkleTree } from "../../merkletree/MerkleTree.js";
import { download } from "../../storage/download.js";
import { upload } from "../../storage/upload.js";
import { encode } from "../../transaction/actions/encode.js";
import { dateToSeconds } from "../date.js";
import { type Hex, toHex } from "../encoding/hex.js";
import { keccak256 } from "../hashing/keccak256.js";
import { toUnits } from "../units.js";
import type {
  AllowlistEntry,
  ClaimConditionsInput,
  ShardData,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function fetchProofsForClaimer(options: {
  contract: ThirdwebContract;
  claimer: string;
  merkleRoot: string;
}) {
  const { contract, merkleRoot, claimer } = options;
  // 1. fetch merkle data from contract URI
  const metadata = await getContractMetadata({
    contract,
  });
  const merkleData: Record<string, string> = metadata.merkle || {};
  const snapshotUri = merkleData[merkleRoot];
  if (!snapshotUri) {
    return undefined;
  }
  // 2. download snapshot data
  const response = await download({
    client: contract.client,
    uri: snapshotUri,
  });
  const merkleInfo: ShardedMerkleTreeInfo = await response.json();

  // 3. download shard data based off the user address
  const shardId = claimer.slice(2, 2 + merkleInfo.shardNybbles).toLowerCase();
  const uri = merkleInfo.baseUri.endsWith("/")
    ? merkleInfo.baseUri
    : `${merkleInfo.baseUri}/`;
  let shardData: ShardData;
  try {
    const shard = await download({
      client: contract.client,
      uri: `${uri}${shardId}.json`,
    });
    shardData = await shard.json();
  } catch (e) {
    // if the file can't be fetched it means claimer not in merkle tree
    return undefined;
  }

  // 4. hash all the entries in that shard and construct the sub merkle tree
  const hashedEntries = await Promise.all(
    shardData.entries.map(async (entry) => {
      return hashEntry(entry);
    }),
  );
  const tree = new MerkleTree(hashedEntries, keccak256, {
    sort: true,
  });
  // 5. get the proof for the claimer + the sub merkle tree root
  const entry = shardData.entries.find(
    (i) => i.address.toLowerCase() === claimer.toLowerCase(),
  );
  if (!entry) {
    return undefined;
  }
  const proof = tree.getHexProof(hashEntry(entry)).concat(shardData.proofs);
  // 6. return the proof and the entry data for the contract call
  return {
    proof,
    quantityLimitPerWallet: convertQuantity({
      quantity: entry.maxClaimable || "unlimited",
      tokenDecimals: 18, // TODO respect entry.currencyAddress decimals
    }),
    pricePerToken: convertQuantity({
      quantity: entry.price || "unlimited",
      tokenDecimals: 18, // TODO respect entry.currencyAddress decimals
    }),
    currency: entry.currencyAddress || ADDRESS_ZERO,
  };
}

export function hashEntry(entry: AllowlistEntry) {
  return keccak256(
    encodePacked(
      ["address", "uint256", "uint256", "address"],
      [
        entry.address,
        convertQuantity({
          quantity: entry.maxClaimable || "unlimited",
          tokenDecimals: 18, // TODO respect entry.currencyAddress decimals
        }),
        convertQuantity({
          quantity: entry.price || "unlimited",
          tokenDecimals: 18, // TODO respect entry.currencyAddress decimals
        }),
        entry.currencyAddress || ADDRESS_ZERO,
      ],
    ),
  );
}

export function convertQuantity(options: {
  quantity: string;
  tokenDecimals: number;
}) {
  const { quantity, tokenDecimals } = options;
  if (quantity === "unlimited") {
    return maxUint256;
  }
  return toUnits(quantity, tokenDecimals);
}

export async function getMulticallSetClaimConditionTransactions(options: {
  phases: ClaimConditionsInput[];
  contract: ThirdwebContract;
  tokenId?: bigint;
  resetClaimEligibility?: boolean;
}): Promise<Hex[]> {
  const merkleInfos: Record<string, string> = {};
  const phases = await Promise.all(
    options.phases.map(async (phase) => {
      // allowlist
      let merkleRoot: string = phase.merkleRootHash || toHex("", { size: 32 });
      if (phase.allowlist) {
        const { shardedMerkleInfo, uri } = await processAllowlist({
          allowlist: phase.allowlist,
          client: options.contract.client,
          tokenDecimals: 0,
        });
        merkleInfos[shardedMerkleInfo.merkleRoot] = uri;
        merkleRoot = shardedMerkleInfo.merkleRoot;
      }
      // metadata
      let metadata = "";
      if (phase.metadata && typeof phase.metadata === "string") {
        metadata = phase.metadata;
      } else if (phase.metadata && typeof phase.metadata === "object") {
        metadata = (
          await upload({
            client: options.contract.client,
            files: [phase.metadata],
          })
        )[0] as string;
      }
      return {
        startTimestamp: dateToSeconds(phase.startTime ?? new Date(0)),
        currency: phase.currencyAddress || NATIVE_TOKEN_ADDRESS,
        pricePerToken: await convertPrice({
          ...phase,
          ...options.contract,
        }),
        maxClaimableSupply: phase.maxClaimableSupply ?? maxUint256,
        quantityLimitPerWallet: phase.maxClaimablePerWallet ?? maxUint256,
        merkleRoot,
        metadata,
        supplyClaimed: 0n,
      } as GeneratedParams["phases"][number];
    }),
  );
  const encodedTransactions: Hex[] = [];
  // if we have new merkle roots, we need to upload them to the contract metadata
  if (Object.keys(merkleInfos).length > 0) {
    const metadata = await getContractMetadata({
      contract: options.contract,
    });
    // keep the old merkle roots from other tokenIds
    for (const key of Object.keys(metadata.merkle || {})) {
      merkleInfos[key] = metadata.merkle[key];
    }
    const mergedMetadata = {
      ...metadata,
      merkle: merkleInfos,
    };
    const uri = (
      await upload({
        client: options.contract.client,
        files: [mergedMetadata],
      })
    )[0] as string;
    const encodedSetContractURI = await encode(
      setContractURI({
        contract: options.contract,
        uri,
      }),
    );
    encodedTransactions.push(encodedSetContractURI);
  }
  const sortedPhases = phases.sort((a, b) =>
    Number(a.startTimestamp - b.startTimestamp),
  );
  let encodedSetClaimConditions: Hex;
  if (options.tokenId !== undefined) {
    // 1155
    encodedSetClaimConditions = await encode(
      setCC1155({
        contract: options.contract,
        tokenId: options.tokenId,
        phases: sortedPhases,
        resetClaimEligibility: options.resetClaimEligibility || false,
      }),
    );
  } else {
    // 721
    encodedSetClaimConditions = await encode(
      setCC721({
        contract: options.contract,
        phases: sortedPhases,
        resetClaimEligibility: options.resetClaimEligibility || false,
      }),
    );
  }
  encodedTransactions.push(encodedSetClaimConditions);
  return encodedTransactions;
}

export async function processAllowlist(options: {
  client: ThirdwebClient;
  allowlist: string[] | AllowlistEntry[];
  tokenDecimals: number;
  shardNybbles?: number;
}) {
  const shardNybbles = options.shardNybbles || 2;
  // 1. convert to fully populated allowlist
  const entries: AllowlistEntry[] = options.allowlist.map((entry) => {
    if (typeof entry === "string") {
      return {
        address: entry,
      };
    }
    return entry;
  });
  // 2. shard them into a map where the key is the first n digits of the address
  const shards: Record<string, AllowlistEntry[]> = {};
  for (const snapshotEntry of entries) {
    const shard = snapshotEntry.address
      .slice(2, 2 + shardNybbles)
      .toLowerCase();
    if (shards[shard] === undefined) {
      shards[shard] = [];
    }
    // biome-ignore lint/style/noNonNullAssertion: we know it's defined
    shards[shard]!.push(snapshotEntry);
  }
  // 3. create the merkle subtrees for each shard
  const subTrees = await Promise.all(
    Object.entries(shards).map(async ([shard, entries]) => [
      shard,
      new MerkleTree(
        await Promise.all(
          entries.map(async (entry) => {
            return hashEntry(entry);
          }),
        ),
        keccak256,
        {
          sort: true,
        },
      ).getHexRoot(),
    ]),
  );
  // 4. create the master merkle tree from all the subtrees
  const roots = Object.fromEntries(subTrees);
  const tree = new MerkleTree(Object.values(roots), keccak256, {
    sort: true,
  });
  // 5. upload all the shards with filename <shardId>.json to easily retrieve
  const shardsToUpload = [];
  for (const [shardId, entries] of Object.entries(shards)) {
    const data: ShardData = {
      proofs: tree.getHexProof(roots[shardId]),
      entries,
    };
    shardsToUpload.push({
      data: JSON.stringify(data),
      name: `${shardId}.json`,
    });
  }
  const uris = await upload({
    client: options.client,
    files: shardsToUpload,
  });
  if (uris.length === 0) {
    throw new Error("No URIs returned from uploading merkle tree shards");
  }
  // biome-ignore lint/style/noNonNullAssertion: throws above if no URIs
  const baseUri = uris[0]!.slice(0, uris[0]!.lastIndexOf("/"));
  // 6. Also upload the original entries for retrieving all entries
  const originalEntriesUri = (
    await upload({
      client: options.client,
      files: [JSON.stringify(entries)],
    })
  )[0] as string;
  // 7. assmeble the final sharded merkle tree info
  const shardedMerkleInfo: ShardedMerkleTreeInfo = {
    merkleRoot: tree.getHexRoot(),
    baseUri,
    originalEntriesUri,
    shardNybbles,
    tokenDecimals: options.tokenDecimals,
    isShardedMerkleTree: true,
  };
  // 8. upload the final sharded merkle tree info
  const masterUri = (
    await upload({
      client: options.client,
      files: [shardedMerkleInfo],
    })
  )[0] as string;
  return {
    shardedMerkleInfo,
    uri: masterUri,
  };
}

async function convertPrice(
  options: ClaimConditionsInput & {
    client: ThirdwebClient;
    chain: Chain;
  },
) {
  let pricePerToken: bigint;
  if ("price" in options && options.price) {
    // for native token, we know decimals are 18
    if (
      !options.currencyAddress ||
      isNativeTokenAddress(options.currencyAddress)
    ) {
      pricePerToken = toUnits(options.price.toString(), 18);
    } else {
      // otherwise get the decimals of the currency
      const currencyContract = getContract({
        client: options.client,
        chain: options.chain,
        address: options.currencyAddress,
      });
      const { decimals } = await import(
        "../../extensions/erc20/read/decimals.js"
      );
      const currencyDecimals = await decimals({
        contract: currencyContract,
      });
      pricePerToken = toUnits(options.price.toString(), currencyDecimals);
    }
  } else if ("priceInWei" in options && options.priceInWei) {
    pricePerToken = BigInt(options.priceInWei);
  } else {
    pricePerToken = 0n;
  }
  return pricePerToken;
}
