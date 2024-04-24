import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC1155 } from "../../../utils/extensions/airdrop/process-snapshot-erc1155.js";
import type { SnapshotEntryERC1155 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoParams = {
  snapshot: SnapshotEntryERC1155[];
  tokenAddress: string;
};

export async function generateMerkleTreeInfoERC1155(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoParams>,
) {
  const { snapshot, contract } = options;

  // generate merkle tree from snapshot
  const { shardedMerkleInfo, uri } = await processSnapshotERC1155({
    snapshot,
    client: contract.client,
  });
  return {
    merkleRoot: shardedMerkleInfo.merkleRoot,
    snapshotUri: uri,
  };
}
