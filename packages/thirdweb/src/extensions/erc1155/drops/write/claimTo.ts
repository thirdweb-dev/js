import type { Address } from "abitype";
import { encodePacked, maxUint256 } from "viem";
import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../../contract/contract.js";
import { MerkleTree } from "../../../../merkletree/MerkleTree.js";
import { download } from "../../../../storage/download.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { type Hex, padHex } from "../../../../utils/encoding/hex.js";
import { keccak256 } from "../../../../utils/hashing/keccak256.js";
import { toUnits } from "../../../../utils/units.js";
import { getContractMetadata } from "../../../common/read/getContractMetadata.js";
import { getActiveClaimCondition } from "../read/getActiveClaimCondition.js";

const CLAIM_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "receiver",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "tokenId",
      type: "uint256",
    },
    {
      internalType: "uint256",
      name: "quantity",
      type: "uint256",
    },
    {
      internalType: "address",
      name: "currency",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "pricePerToken",
      type: "uint256",
    },
    {
      components: [
        {
          internalType: "bytes32[]",
          name: "proof",
          type: "bytes32[]",
        },
        {
          internalType: "uint256",
          name: "quantityLimitPerWallet",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "pricePerToken",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "currency",
          type: "address",
        },
      ],
      internalType: "struct IDrop.AllowlistProof",
      name: "allowlistProof",
      type: "tuple",
    },
    {
      internalType: "bytes",
      name: "data",
      type: "bytes",
    },
  ],
  name: "claim",
  outputs: [],
  stateMutability: "payable",
  type: "function",
} as const;

export type ClaimToParams = {
  to: Address;
  tokenId: bigint;
  quantity: bigint;
};

/**
 * Claim ERC721 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC721
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc1155";
 * const tx = await claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: CLAIM_ABI,
    params: async () => {
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      let proofData = {
        currency: cc.currency,
        proof: [] as `0x${string}`[],
        quantityLimitPerWallet: cc.quantityLimitPerWallet,
        pricePerToken: cc.pricePerToken,
      };
      if (cc.merkleRoot !== padHex("0x", { size: 32 })) {
        const claimerProof = await fetchProofsForClaimer({
          contract: options.contract,
          claimer: options.to,
          merkleRoot: cc.merkleRoot,
        });
        if (claimerProof) {
          proofData = claimerProof;
        }
      }
      return [
        options.to, //receiver
        options.tokenId, //tokenId
        options.quantity, //quantity
        cc.currency, //currency
        cc.pricePerToken, //pricePerToken
        // proof
        proofData,
        // end proof
        "0x", //data
      ] as const;
    },
    value: async () => {
      // TODO this should not be refetched
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      if (isNativeTokenAddress(cc.currency)) {
        return cc.pricePerToken * BigInt(options.quantity);
      }
      return 0n;
    },
  });
}

// UTILS - TODO extract this

async function fetchProofsForClaimer(options: {
  contract: ThirdwebContract;
  claimer: string;
  merkleRoot: string;
}) {
  const { contract, merkleRoot, claimer } = options;
  // 1. fetch merkle data from contract URI
  const metadata = await getContractMetadata({
    contract,
  });
  const merkleData: Record<string, string> = metadata.merkle;
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

function hashEntry(entry: AllowlistEntry) {
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

function convertQuantity(options: {
  quantity: string;
  tokenDecimals: number;
}) {
  const { quantity, tokenDecimals } = options;
  if (quantity === "unlimited") {
    return maxUint256;
  }
  return toUnits(quantity, tokenDecimals);
}

type ShardedMerkleTreeInfo = {
  merkleRoot: string;
  baseUri: string;
  originalEntriesUri: string;
  shardNybbles: number;
  tokenDecimals: number;
  isShardedMerkleTree: true;
};

export type ShardData = {
  proofs: Hex[];
  entries: AllowlistEntry[];
};

export type AllowlistEntry = {
  address: string;
  maxClaimable?: string;
  price?: string;
  currencyAddress?: string;
};
