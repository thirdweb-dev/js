import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC20 } from "../../../utils/extensions/airdrop/process-snapshot-erc20.js";
import type { SnapshotEntryERC20 } from "../../../utils/extensions/airdrop/types.js";
import { setContractURI } from "../../common/__generated__/IContractMetadata/write/setContractURI.js";

export type GenerateMerkleTreeInfoParams = {
  snapshot: SnapshotEntryERC20[];
  tokenAddress: string;
};

export type SaveSnapshotParams = {
  merkleRoot: string;
  snapshotUri: string;
};

export async function generateMerkleTreeInfoERC20(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoParams>,
) {
  const { snapshot, contract } = options;

  // get token decimals
  const tokenAddress = options.tokenAddress;
  const tokenDecimals = await (async () => {
    if (isNativeTokenAddress(tokenAddress) || tokenAddress === ADDRESS_ZERO) {
      throw new Error("Token address can't be zero address or native token");
    }
    const [{ getContract }, { decimals: getDecimals }] = await Promise.all([
      import("../../../contract/contract.js"),
      import("../../erc20/read/decimals.js"),
    ]);
    const tokenContract = getContract({
      address: tokenAddress,
      chain: contract.chain,
      client: contract.client,
    });
    return await getDecimals({ contract: tokenContract });
  })();

  // generate merkle tree from snapshot
  const { shardedMerkleInfo, uri } = await processSnapshotERC20({
    snapshot,
    client: contract.client,
    tokenDecimals,
  });
  return {
    merkleRoot: shardedMerkleInfo.merkleRoot,
    snapshotUri: uri,
  };
}

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
