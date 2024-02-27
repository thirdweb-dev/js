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
import { providers, utils } from "ethers";
import { parseSnapshotInputs } from "./parseSnapshotInputs";
import { MerkleTree } from "@thirdweb-dev/merkletree";
import { SnapshotEntry } from "../schema/contracts/common/snapshots";

/**
 * Create a snapshot (merkle tree) from a list of addresses and uploads it to IPFS
 * @param snapshotInput - the list of addresses to hash
 * @param tokenDecimals - the token decimals
 * @param provider - the provider to use
 * @param storage - the storage to upload to
 * @param snapshotFormatVersion - the snapshot format version
 * @returns The generated snapshot and URI
 * @internal
 */
export async function createSnapshot(
  snapshotInput: SnapshotInput,
  tokenDecimals: number,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<SnapshotInfo> {
  const input = await parseSnapshotInputs(snapshotInput);
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

/**
 * Create a MerkleTree based on an allow list of addresses and maxClaimable
 * @param snapshotInput - the list of addresses and maxClaimable
 * @param tokenDecimals - optional decimals for the token to claim (default 18)
 * @param version - optional version of the snapshot format (default V1)
 * @returns The generated MerkleTree
 */
export async function createMerkleTreeFromAllowList(
  snapshotInput: SnapshotInput,
  tokenDecimals: number = 18,
  version: SnapshotFormatVersion = SnapshotFormatVersion.V1,
): Promise<MerkleTree> {
  const input = await parseSnapshotInputs(snapshotInput);
  const addresses = input.map((i) => i.address);
  const hasDuplicates = new Set(addresses).size < addresses.length;
  if (hasDuplicates) {
    throw new DuplicateLeafsError();
  }
  const leaves = input.map((i) => {
    return hashAllowListEntry(i, tokenDecimals, version);
  });
  const tree = new MerkleTree(leaves, utils.keccak256, {
    sort: true,
  });
  return tree;
}

/**
 * Get the proofs for a given entry of addresses
 * @param merkleTree - the merkle tree to get the proof from
 * @param snapshotEntry - the entry to get the proof for
 * @param tokenDecimals - optional decimals for the token to claim (default 18)
 * @param version - optional version of the snapshot format (default V1)
 * @returns
 */
export async function getProofsForAllowListEntry(
  merkleTree: MerkleTree,
  snapshotEntry: SnapshotEntry,
  tokenDecimals: number = 18,
  version: SnapshotFormatVersion = SnapshotFormatVersion.V1,
) {
  return merkleTree.getProof(
    hashAllowListEntry(snapshotEntry, tokenDecimals, version),
  );
}

/**
 * Hash an allow list entry for use in a MerkleTree
 * @param snapshotEntry - the entry to hash
 * @param tokenDecimals - optional decimals for the token to claim (default 18)
 * @param version - optional version of the snapshot format (default V1)
 * @returns
 */
export function hashAllowListEntry(
  snapshotEntry: SnapshotEntry,
  tokenDecimals: number = 18,
  version: SnapshotFormatVersion = SnapshotFormatVersion.V1,
) {
  return ShardedMerkleTree.hashEntry(
    snapshotEntry,
    tokenDecimals,
    tokenDecimals,
    version,
  );
}
