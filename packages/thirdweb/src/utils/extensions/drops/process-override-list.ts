import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { MerkleTree } from "../../../merkletree/MerkleTree.js";
import { upload } from "../../../storage/upload.js";
import type { Hex } from "../../encoding/hex.js";
import { hashEntry } from "./hash-entry.js";
import type {
  OverrideEntry,
  ShardData,
  ShardedMerkleTreeInfo,
} from "./types.js";

export async function processOverrideList(options: {
  client: ThirdwebClient;
  chain: Chain;
  overrides: OverrideEntry[];
  tokenDecimals: number;
  shardNybbles?: number;
}) {
  const shardNybbles = options.shardNybbles || 2;
  // 2. shard them into a map where the key is the first n digits of the address
  const shards: Record<string, OverrideEntry[]> = {};
  for (const snapshotEntry of options.overrides) {
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
            return hashEntry({
              entry,
              chain: options.chain,
              client: options.client,
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
    const data: ShardData = {
      // biome-ignore lint/style/noNonNullAssertion: we know this is in bounds
      proofs: tree.getHexProof(roots[shardId]!),
      entries,
    };
    shardsToUpload.push({
      data: JSON.stringify(data),
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
    files: [JSON.stringify(options.overrides)],
  });
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
  const finalUri = await upload({
    client: options.client,
    files: [shardedMerkleInfo],
  });
  return {
    shardedMerkleInfo,
    uri: finalUri,
  };
}
