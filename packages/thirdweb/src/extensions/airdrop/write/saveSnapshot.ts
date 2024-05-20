import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { setContractURI } from "../../common/__generated__/IContractMetadata/write/setContractURI.js";

export type SaveSnapshotParams = {
  merkleRoot: string;
  snapshotUri: string;
};

/**
 * Generate merkle tree for a given snapshot and save the info on-chain.
 * @param options - The transaction options.
 * @example
 * ```ts
 *
 * // This is ERC20 example. Should import and use other ERC variants as needed
 *
 * import { generateMerkleTreeInfoERC20, saveSnapshot, setMerkleRoot } from "thirdweb/extensions/airdrop";
 *
 * // snapshot / allowlist of airdrop recipients and amounts
 * const snapshot = [
 *    { recipient: "0x...", amount: 10 },
 *    { recipient: "0x...", amount: 15 },
 *    { recipient: "0x...", amount: 20 },
 * ];
 *
 * const tokenAddress = "0x..." // Address of airdrop token
 *
 * const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC20({
 *    contract,
 *    tokenAddress,
 *    snapshot
 * });
 *
 * const saveSnapshotTransaction = saveSnapshot({
 *   contract,
 *   merkleRoot,
 *   snapshotUri,
 * });
 * await sendTransaction({ saveSnapshotTransaction, account });
 *
 * const setMerkleRootTransaction = setMerkleRoot({
 *   contract,
 *   token,
 *   tokenMerkleRoot: merkleRoot as `0x${string}`,
 *   resetClaimStatus: false // toggle as needed
 *   signature,
 * });
 * await sendTransaction({ setMerkleRootTransaction, account });
 *
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the transaction result.
 */
export function saveSnapshot(
  options: BaseTransactionOptions<SaveSnapshotParams>,
) {
  return setContractURI({
    contract: options.contract,
    asyncParams: async () => {
      const merkleInfos: Record<string, string> = {};
      // need to upload merkle tree info to the contract metadata

      const [{ getContractMetadata }, { contractURI }] = await Promise.all([
        import("../../common/read/getContractMetadata.js"),
        import(
          "../../common/__generated__/IContractMetadata/read/contractURI.js"
        ),
      ]);
      const metadata = await getContractMetadata({
        contract: options.contract,
      });
      const contractUri = await contractURI({
        contract: options.contract,
      });

      merkleInfos[options.merkleRoot] = options.snapshotUri;

      // keep the old merkle roots from other tokenIds
      for (const key of Object.keys(metadata.merkle || {})) {
        merkleInfos[key] = metadata.merkle[key];
      }
      const mergedMetadata = {
        ...metadata,
        merkle: merkleInfos,
      };
      const uri = await upload({
        client: options.contract.client,
        files: [mergedMetadata],
      });

      if (uri === contractUri) {
        throw new Error("Merkle tree info already saved");
      }

      return {
        uri,
      } as const;
    },
  });
}
