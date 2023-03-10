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
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { ethers } from "ethers";

/**
 * Create a snapshot (merkle tree) from a list of addresses and uploads it to IPFS
 * @param snapshotInput - the list of addresses to hash
 * @param tokenDecimals - the token decimals
 * @param provider
 * @param storage - the storage to upload to
 * @param snapshotFormatVersion
 * @returns the generated snapshot and URI
 * @internal
 */
export async function createSnapshot(
  snapshotInput: SnapshotInput,
  tokenDecimals: number,
  provider: ethers.providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<SnapshotInfo> {
  const input = await SnapshotInputSchema.parseAsync(snapshotInput);
  const addresses = input.map((i) => i.address);
  const hasDuplicates = new Set(addresses).size < addresses.length;
  if (hasDuplicates) {
    throw new DuplicateLeafsError();
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
