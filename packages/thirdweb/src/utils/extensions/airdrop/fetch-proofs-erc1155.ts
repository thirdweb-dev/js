import type { ThirdwebContract } from "../../../contract/contract.js";
import { getContractMetadata } from "../../../extensions/common/read/getContractMetadata.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import type { Address } from "../../address.js";
import { hashEntryERC1155 } from "./hash-entry-erc1155.js";
import type {
  ClaimProofERC1155,
  ShardDataERC1155,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function fetchProofsERC1155(options: {
  contract: ThirdwebContract;
  recipient: string;
  merkleRoot: string;
}): Promise<ClaimProofERC1155 | null> {
  const { contract, merkleRoot, recipient } = options;
  // 1. fetch merkle data from contract URI
  const metadata = await getContractMetadata({
    contract,
  });
  const merkleData: Record<string, string> = metadata.merkle || {};
  const snapshotUri = merkleData[merkleRoot];

  if (!snapshotUri) {
    console.log("no snapshot uri");
    return null;
  }
  // 2. download snapshot data
  const response = await download({
    client: contract.client,
    uri: snapshotUri,
  });
  const merkleInfo: ShardedMerkleTreeInfo = await response.json();

  // 3. download shard data based off the user address
  const shardId = recipient.slice(2, 2 + merkleInfo.shardNybbles).toLowerCase();
  const uri = merkleInfo.baseUri.endsWith("/")
    ? merkleInfo.baseUri
    : `${merkleInfo.baseUri}/`;
  let shardData: ShardDataERC1155;

  try {
    const constructedShardUri = `${uri}${shardId}.json`;
    const shard = await download({
      client: contract.client,
      uri: constructedShardUri,
    });
    shardData = await shard.json();
  } catch (e) {
    // if the file can't be fetched it means claimer not in merkle tree
    return null;
  }

  // 4. hash all the entries in that shard and construct the sub merkle tree
  const hashedEntries = await Promise.all(
    shardData.entries.map(async (entry) => {
      return hashEntryERC1155({
        entry,
      });
    }),
  );
  const tree = new MerkleTree(hashedEntries);
  // 5. get the proof for the claimer + the sub merkle tree root
  const entry = shardData.entries.find(
    (i) => i.recipient.toLowerCase() === recipient.toLowerCase(),
  );
  if (!entry) {
    return null;
  }
  const proof = tree
    .getHexProof(
      await hashEntryERC1155({
        entry,
      }),
    )
    .concat(shardData.proofs);

  return {
    proof,
    recipient: recipient as Address,
    tokenId: BigInt(entry.tokenId),
    quantity: BigInt(entry.amount),
  };
}
