import { SnapshotInputSchema } from "../schema/contracts/common/snapshots";
import {
  SnapshotInfo,
  SnapshotInput,
} from "../types/claim-conditions/claim-conditions";
import { DuplicateLeafsError } from "./error";
import { ShardedMerkleTree } from "./sharded-merkle-tree";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { BigNumber, BigNumberish, utils } from "ethers";

/**
 * Create a snapshot (merkle tree) from a list of addresses and uploads it to IPFS
 * @param snapshotInput - the list of addresses to hash
 * @param tokenDecimals - the token decimals
 * @param storage - the storage to upload to
 * @returns the generated snapshot and URI
 * @internal
 */
export async function createSnapshot(
  snapshotInput: SnapshotInput,
  tokenDecimals: number,
  storage: ThirdwebStorage,
): Promise<SnapshotInfo> {
  const input = SnapshotInputSchema.parse(snapshotInput);
  const addresses = input.map((i) => i.address);
  const hasDuplicates = new Set(addresses).size < addresses.length;
  if (hasDuplicates) {
    throw new DuplicateLeafsError();
  }
  const tree = await ShardedMerkleTree.buildAndUpload(
    input,
    tokenDecimals,
    storage,
  );
  return {
    merkleRoot: tree.shardedMerkleInfo.merkleRoot,
    snapshotUri: tree.uri,
  };
}

/**
 * Hash an address and the corresponding claimable amount
 * @internal
 * @param address - the address
 * @param maxClaimableAmount - the amount
 */
export function hashLeafNode(
  address: string,
  maxClaimableAmount: BigNumberish,
): string {
  return utils.solidityKeccak256(
    ["address", "uint256"],
    [address, BigNumber.from(maxClaimableAmount)],
  );
}
