import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers, utils } from "ethers";
import MerkleTree from "merkletreejs";
import { SnapshotInputSchema } from "../schema";
import {
  SnapshotInfo,
  SnapshotInput,
} from "../types/claim-conditions/claim-conditions";
import { DuplicateLeafsError } from "./error";
import {
  ShardedMerkleTree,
  SnapshotFormatVersion,
} from "./sharded-merkle-tree";

/**
 * Create a snapshot (merkle tree) from a list of addresses and uploads it to IPFS
 * @param snapshotInput - the list of addresses to hash
 * @param tokenDecimals - the token decimals
 * @param provider
 * @param storage - the storage to upload to
 * @param snapshotFormatVersion
 * @param chunkSize - the size of the chunks to split the snapshot into
 * @returns the generated snapshot and URI
 * @internal
 */
export async function createSnapshot(
  snapshotInput: SnapshotInput,
  tokenDecimals: number,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
  chunkSize?: number,
): Promise<SnapshotInfo> {
  const input = await SnapshotInputSchema.parseAsync(snapshotInput);
  const addresses = input.map((i) => i.address);
  const hasDuplicates = new Set(addresses).size < addresses.length;
  if (hasDuplicates) {
    throw new DuplicateLeafsError();
  }

  if (chunkSize) {
    const chunkedMerkleTrees: { merkleRoot: string; snapshotUri: string; }[] = [];
  
    for (let i = 0; i < input.length; i += chunkSize) {
      const chunk = input.slice(i, i + chunkSize);
      const tree = await ShardedMerkleTree.buildAndUpload(
        chunk,
        tokenDecimals,
        provider,
        storage,
        snapshotFormatVersion,
      );
  
      chunkedMerkleTrees.push({
        merkleRoot: tree.shardedMerkleInfo.merkleRoot,
        snapshotUri: tree.uri,
      });
    }
    const chunkedMerkleRoots = chunkedMerkleTrees.map((tree) => tree.merkleRoot);
    const chunkedSnapshotUris = chunkedMerkleTrees.map((tree) => tree.snapshotUri);

    // Combine the merkle roots from all chunks by creating a new Merkle tree
    const combinedTree = new MerkleTree(chunkedMerkleRoots, utils.keccak256, {
      sort: true,
    });

    const combinedMerkleRoot = combinedTree.getHexRoot();

    const combinedSnapshotUri = await storage.upload({
      merkleRoot: combinedMerkleRoot,
      snapshotUris: chunkedSnapshotUris,
    });

    return {
      merkleRoot: combinedMerkleRoot,
      snapshotUri: combinedSnapshotUri,
    };
  }

  const tree = await ShardedMerkleTree.buildAndUpload(
    input,
    tokenDecimals,
    provider,
    storage,
    snapshotFormatVersion,
  );

  return {
    merkleRoot: tree.shardedMerkleInfo.merkleRoot,
    snapshotUri: tree.uri,
  };
}