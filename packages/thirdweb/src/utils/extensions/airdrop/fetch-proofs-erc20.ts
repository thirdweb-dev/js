import type { ThirdwebContract } from "../../../contract/contract.js";
import { getContractMetadata } from "../../../extensions/common/read/getContractMetadata.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { download } from "../../../storage/download.js";
import type { Address } from "../../address.js";
import { convertQuantity } from "../drops/convert-quantity.js";
import { hashEntryERC20 } from "./hash-entry-erc20.js";
import type {
  ClaimProofERC20,
  ShardDataERC20,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function fetchProofsrERC20(options: {
  contract: ThirdwebContract;
  recipient: string;
  merkleRoot: string;
  tokenDecimals: number;
}): Promise<ClaimProofERC20 | null> {
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
  let shardData: ShardDataERC20;

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
      return hashEntryERC20({
        entry,
        tokenDecimals: options.tokenDecimals,
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
      await hashEntryERC20({
        entry,
        tokenDecimals: options.tokenDecimals,
      }),
    )
    .concat(shardData.proofs);

  const quantity = convertQuantity({
    quantity: entry.amount.toString(),
    tokenDecimals: options.tokenDecimals,
  });

  return {
    proof,
    recipient: recipient as Address,
    quantity,
  };
}
