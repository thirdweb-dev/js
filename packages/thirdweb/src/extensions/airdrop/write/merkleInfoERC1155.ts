import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC1155 } from "../../../utils/extensions/airdrop/process-snapshot-erc1155.js";
import type { SnapshotEntryERC1155 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoERC1155Params = {
  snapshot: SnapshotEntryERC1155[];
  tokenAddress: string;
};

/**
 * Generate merkle tree for a given snapshot.
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { generateMerkleTreeInfoERC1155 } from "thirdweb/extensions/airdrop";
 *
 * // snapshot / allowlist of airdrop recipients and amounts
 * const snapshot = [
 *    { recipient: "0x...", tokenId: 0, amount: 10 },
 *    { recipient: "0x...", tokenId: 1, amount: 12 },
 *    { recipient: "0x...", tokenId: 2, amount: 15 },
 * ];
 *
 * const tokenAddress = "0x..." // Address of ERC1155 airdrop token
 *
 * const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC1155({
 *    contract,
 *    tokenAddress,
 *    snapshot
 * });
 *
 * // Optional next steps {See: saveSnapshot and setMerkleRoot functions}
 * // - Save snapshot on-chain (on the airdrop contract uri)
 * // - Set merkle root on the contract to enable claiming
 *
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the merkle-root and snapshot-uri.
 */
export async function generateMerkleTreeInfoERC1155(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoERC1155Params>,
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
