import { encodePacked, keccak256, maxUint256 } from "viem";
import { ADDRESS_ZERO } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import { toUnits } from "../../../utils/units.js";
import { getContractMetadata } from "../../common/read/getContractMetadata.js";
import type {
  AllowlistEntry,
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
