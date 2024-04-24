import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC721 } from "../../../utils/extensions/airdrop/process-snapshot-erc721.js";
import type { SnapshotEntryERC721 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoParams = {
  snapshot: SnapshotEntryERC721[];
  tokenAddress: string;
};

export async function generateMerkleTreeInfoERC721(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoParams>,
) {
  const { snapshot, contract } = options;

  // generate merkle tree from snapshot
  const { shardedMerkleInfo, uri } = await processSnapshotERC721({
    snapshot,
    client: contract.client,
  });
  return {
    merkleRoot: shardedMerkleInfo.merkleRoot,
    snapshotUri: uri,
  };
}
