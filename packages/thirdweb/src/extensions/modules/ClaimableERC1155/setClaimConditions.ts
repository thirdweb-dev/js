import { maxUint256 } from "ox/Solidity";
import { encodePacked } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { type Hex, toHex } from "../../../utils/encoding/hex.js";
import { processOverrideList } from "../../../utils/extensions/drops/process-override-list.js";
import type { ClaimConditionInput } from "../../../utils/extensions/drops/types.js";
import { keccak256 } from "../../../utils/hashing/keccak256.js";
import { setClaimConditionByTokenId as generatedSetClaimCondition } from "../__generated__/ClaimableERC1155/write/setClaimConditionByTokenId.js";

/**
 * Sets the claim conditions for a given token ID.
 * @param options - The options for setting the claim conditions.
 * @returns A transaction to set the claim conditions.
 * @modules ClaimableERC1155
 * @example
 * ```ts
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC1155.setClaimCondition({
 *   contract: contract,
 *   tokenId: 0n,
 *   pricePerToken: "1", // in ETH
 *   maxClaimableSupply: "1000000",
 *   maxClaimablePerWallet: "1",
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 */
export function setClaimCondition(
  options: BaseTransactionOptions<ClaimConditionInput & { tokenId: bigint }>,
) {
  return generatedSetClaimCondition({
    contract: options.contract,
    asyncParams: async () => {
      const { convertErc20Amount } = await import(
        "../../../utils/extensions/convert-erc20-amount.js"
      );
      const startTime = options.startTime || new Date(0);
      const endTime = options.endTime || tenYearsFromNow();
      const [pricePerUnit, availableSupply, maxMintPerWallet] =
        await Promise.all([
          options.pricePerToken
            ? convertErc20Amount({
                chain: options.contract.chain,
                client: options.contract.client,
                erc20Address: options.currencyAddress || NATIVE_TOKEN_ADDRESS,
                amount: options.pricePerToken.toString(),
              })
            : 0n,
          options.maxClaimableSupply
            ? BigInt(options.maxClaimableSupply)
            : maxUint256,
          options.maxClaimablePerWallet
            ? BigInt(options.maxClaimablePerWallet)
            : maxUint256,
        ]);

      // allowlist + metadata
      let metadata = "";
      let merkleRoot: Hex = toHex("", { size: 32 });
      if (options.allowList) {
        const { shardedMerkleInfo, uri } = await processOverrideList({
          overrides: options.allowList.map((entry) => ({
            address: entry,
          })),
          client: options.contract.client,
          chain: options.contract.chain,
          tokenDecimals: 18, // unused in this case
          async hashEntry(options) {
            return keccak256(
              encodePacked(["address"], [getAddress(options.entry.address)]),
            );
          },
        });
        merkleRoot = shardedMerkleInfo.merkleRoot;
        metadata = await upload({
          client: options.contract.client,
          files: [
            {
              merkleRoot: shardedMerkleInfo.merkleRoot,
              merkleTreeUri: uri,
            },
          ],
        });
      }

      return {
        tokenId: options.tokenId,
        claimCondition: {
          startTimestamp: Number(dateToSeconds(startTime)),
          endTimestamp: Number(dateToSeconds(endTime)),
          pricePerUnit,
          currency: getAddress(options.currencyAddress || NATIVE_TOKEN_ADDRESS),
          availableSupply,
          maxMintPerWallet,
          allowlistMerkleRoot: merkleRoot,
          auxData: metadata, // stores the merkle root and merkle tree uri in IPFS
        },
      };
    },
  });
}
