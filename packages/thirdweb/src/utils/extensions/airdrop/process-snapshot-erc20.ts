import type { ThirdwebClient } from "../../../client/client.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { upload } from "../../../storage/upload.js";
import type { Hex } from "../../encoding/hex.js";
import { stringify } from "../../json.js";
import { hashEntryERC20 } from "./hash-entry-erc20.js";
import type {
  ShardDataERC20,
  ShardedMerkleTreeInfo,
  SnapshotEntryERC20,
} from "./types.js";

export async function processSnapshotERC20(options: {
  client: ThirdwebClient;
  snapshot: SnapshotEntryERC20[];
  tokenDecimals: number;
  shardNybbles?: number;
}) {
  const shardNybbles = options.shardNybbles || 2;
  // 2. shard them into a map where the key is the first n digits of the address
  const shards: Record<string, SnapshotEntryERC20[]> = {};
  for (const snapshotEntry of options.snapshot) {
    const shard = snapshotEntry.recipient
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
            return hashEntryERC20({
              entry,
              tokenDecimals: options.tokenDecimals,
            });
          }),
        ),
      ).getHexRoot(),
    ]),
  );
  // 4. create the master merkle tree from all the subtrees
  const roots: Record<string, Hex> = Object.fromEntries(subTrees);
  const tree = new MerkleTree(Object.values(roots));
  // 5. upload all the shards with filename <shardId>.json to easily retrieve
  const shardsToUpload = [];
  for (const [shardId, entries] of Object.entries(shards)) {
    const data: ShardDataERC20 = {
      entries,
      // biome-ignore lint/style/noNonNullAssertion: we know this is in bounds
      proofs: tree.getHexProof(roots[shardId]!),
    };
    shardsToUpload.push({
      data: stringify(data),
      name: `${shardId}.json`,
    });
  }
  let uris = await upload({
    client: options.client,
    files: shardsToUpload,
  });
  // in the case of just 1 shard -> upload returns a string, not an array
  if (!Array.isArray(uris)) {
    uris = [uris];
  }
  if (uris.length === 0) {
    throw new Error("No URIs returned from uploading merkle tree shards");
  }
  // biome-ignore lint/style/noNonNullAssertion: throws above if no URIs
  const baseUri = uris[0]!.slice(0, uris[0]!.lastIndexOf("/"));
  // 6. Also upload the original entries for retrieving all entries
  const originalEntriesUri = await upload({
    client: options.client,
    files: [stringify(options.snapshot)],
  });
  // 7. assmeble the final sharded merkle tree info
  const shardedMerkleInfo: ShardedMerkleTreeInfo = {
    baseUri,
    isShardedMerkleTree: true,
    merkleRoot: tree.getHexRoot(),
    originalEntriesUri,
    shardNybbles,
    tokenDecimals: options.tokenDecimals,
  };
  // 8. upload the final sharded merkle tree info
  const finalUri = await upload({
    client: options.client,
    files: [shardedMerkleInfo],
  });
  return {
    shardedMerkleInfo,
    uri: finalUri,
  };
}
