import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { setContractURI } from "../__generated__/Airdrop/write/setContractURI.js";

export type SaveSnapshotParams = {
  merkleRoot: string;
  snapshotUri: string;
};

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
