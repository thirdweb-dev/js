import {
  ADDRESS_ZERO,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { processSnapshotERC20 } from "../../../utils/extensions/airdrop/process-snapshot-erc20.js";
import type { SnapshotEntryERC20 } from "../../../utils/extensions/airdrop/types.js";

export type GenerateMerkleTreeInfoERC20Params = {
  snapshot: SnapshotEntryERC20[];
  tokenAddress: string;
};

/**
 * Generate merkle tree for a given snapshot.
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { generateMerkleTreeInfoERC20 } from "thirdweb/extensions/airdrop";
 *
 * // snapshot / allowlist of airdrop recipients and amounts
 * const snapshot = [
 *    { recipient: "0x...", amount: 10 },
 *    { recipient: "0x...", amount: 15 },
 *    { recipient: "0x...", amount: 20 },
 * ];
 *
 * const tokenAddress = "0x..." // Address of ERC20 airdrop token
 *
 * const { merkleRoot, snapshotUri } = await generateMerkleTreeInfoERC20({
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
export async function generateMerkleTreeInfoERC20(
  options: BaseTransactionOptions<GenerateMerkleTreeInfoERC20Params>,
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
