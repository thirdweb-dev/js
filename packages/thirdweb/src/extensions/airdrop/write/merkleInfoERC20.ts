import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC20 } from "../../../utils/extensions/airdrop/process-snapshot-erc20.js";
import type { SnapshotEntryERC20 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoParams = {
  snapshot: SnapshotEntryERC20[];
  tokenAddress: string;
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
