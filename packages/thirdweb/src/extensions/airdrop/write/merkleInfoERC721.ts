import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC721 } from "../../../utils/extensions/airdrop/process-snapshot-erc721.js";
import type { SnapshotEntryERC721 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoERC721Params = {
  snapshot: SnapshotEntryERC721[];
  tokenAddress: string;
};

/**
 * Generate merkle tree for a given snapshot.
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { generateMerkleTreeInfoERC721 } from "thirdweb/extensions/airdrop";
 *
 * // snapshot / allowlist of airdrop recipients and amounts
 * const snapshot = [
 *    { recipient: "0x...", tokenId: 0 },
 *    { recipient: "0x...", tokenId: 1 },
 *    { recipient: "0x...", tokenId: 2 },
 * ];
 *
 * const tokenAddress = "0x..." // Address of ERC721 airdrop token
 *
 * const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC721({
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
export async function generateMerkleTreeInfoERC721(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoERC721Params>,
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
