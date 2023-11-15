import {
  SnapshotEntry,
  SnapshotSchema,
} from "../../schema/contracts/common/snapshots";
import { ShardedMerkleTree } from "../sharded-merkle-tree";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

/**
 * @internal
 * @param merkleRoot - The merkle root to fetch the snapshot for
 * @param merkleMetadata - The merkle metadata to use
 * @param storage - The storage to use
 */
export async function fetchSnapshot(
  merkleRoot: string,
  merkleMetadata: Record<string, string> | undefined,
  storage: ThirdwebStorage,
): Promise<SnapshotEntry[] | null> {
  if (!merkleMetadata) {
    return null;
  }
  const snapshotUri = merkleMetadata[merkleRoot];
  if (snapshotUri) {
    const raw = await storage.downloadJSON(snapshotUri);
    if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
      const smt = await ShardedMerkleTree.fromUri(snapshotUri, storage);
      return smt?.getAllEntries() || null;
    } else {
      const snapshotData = await SnapshotSchema.parseAsync(raw);
      if (merkleRoot === snapshotData.merkleRoot) {
        return snapshotData.claims.map((claim) => ({
          address: claim.address,
          maxClaimable: claim.maxClaimable,
          price: claim.price,
          currencyAddress: claim.currencyAddress,
        }));
      }
    }
  }
  return null;
}
