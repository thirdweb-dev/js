import {
  SnapshotEntryWithProof,
  SnapshotSchema,
} from "../../schema/contracts/common/snapshots";
import {
  ShardedMerkleTree,
  SnapshotFormatVersion,
} from "../sharded-merkle-tree";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import type { providers } from "ethers";

/**
 * @internal
 */
export async function fetchSnapshotEntryForAddress(
  address: string,
  merkleRoot: string,
  merkleMetadata: Record<string, string> | undefined,
  provider: providers.Provider,
  storage: ThirdwebStorage,
  snapshotFormatVersion: SnapshotFormatVersion,
): Promise<SnapshotEntryWithProof | null> {
  if (!merkleMetadata) {
    return null;
  }
  const snapshotUri = merkleMetadata[merkleRoot];
  if (snapshotUri) {
    const raw = await storage.downloadJSON(snapshotUri);
    if (raw.isShardedMerkleTree && raw.merkleRoot === merkleRoot) {
      const merkleTree = await ShardedMerkleTree.fromShardedMerkleTreeInfo(
        raw,
        storage,
      );
      return await merkleTree.getProof(
        address,
        provider,
        snapshotFormatVersion,
      );
    }
    // legacy non-sharded, just fetch it all and filter out
    const snapshotData = await SnapshotSchema.parseAsync(raw);
    if (merkleRoot === snapshotData.merkleRoot) {
      return (
        snapshotData.claims.find(
          (c) => c.address.toLowerCase() === address.toLowerCase(),
        ) || null
      );
    }
  }
  return null;
}
