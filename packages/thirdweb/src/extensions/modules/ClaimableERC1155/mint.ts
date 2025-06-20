import { encodePacked, getAddress, keccak256 } from "viem";
import { isNativeTokenAddress } from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type Hex, padHex } from "../../../utils/encoding/hex.js";
import { encodeBytesBeforeMintERC1155Params } from "../__generated__/ClaimableERC1155/encode/encodeBytesBeforeMintERC1155.js";
import { getClaimConditionByTokenId } from "../__generated__/ClaimableERC1155/read/getClaimConditionByTokenId.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";

type MintParams = {
  to: string;
  tokenId: bigint;
  quantity: string | number;
};

/**
 * Mints ERC1155 tokens to a specified address via a ClaimableERC1155 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { ClaimableERC1155 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC1155.mint({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   quantity: 2, // Amount of tokens to mint
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules ClaimableERC1155
 */
export function mint(options: BaseTransactionOptions<MintParams>) {
  return generatedMint({
    asyncParams: async () => {
      const cc = await getClaimConditionByTokenId({
        contract: options.contract,
        tokenId: options.tokenId,
      });

      const totalPrice = cc.pricePerUnit * BigInt(options.quantity);
      const value = isNativeTokenAddress(cc.currency) ? totalPrice : 0n;
      const erc20Value =
        !isNativeTokenAddress(cc.currency) && cc.pricePerUnit > 0n
          ? {
              amountWei: totalPrice,
              tokenAddress: cc.currency,
            }
          : undefined;

      let recipientAllowlistProof: Hex[] = [];
      if (
        cc.allowlistMerkleRoot &&
        cc.allowlistMerkleRoot !== padHex("0x", { size: 32 })
      ) {
        const { fetchProofsForClaimer } = await import(
          "../../../utils/extensions/drops/fetch-proofs-for-claimers.js"
        );
        const metadataUri = cc.auxData;
        if (metadataUri) {
          // download merkle tree from metadata
          const metadata = await download({
            client: options.contract.client,
            uri: metadataUri,
          });
          const metadataJson: {
            merkleTreeUri: string;
          } = await metadata.json();
          const merkleTreeUri = metadataJson.merkleTreeUri;

          // fetch proofs
          if (merkleTreeUri) {
            const allowlistProof = await fetchProofsForClaimer({
              claimer: options.to,
              contract: options.contract,
              async hashEntry(options) {
                return keccak256(
                  encodePacked(
                    ["address"],
                    [getAddress(options.entry.address)],
                  ),
                );
              },
              merkleTreeUri, // unused here
              tokenDecimals: 18,
            });
            recipientAllowlistProof = allowlistProof?.proof || [];
          }
        }
      }

      return {
        amount: BigInt(options.quantity),
        baseURI: "",
        data: encodeBytesBeforeMintERC1155Params({
          params: {
            currency: cc.currency,
            pricePerUnit: cc.pricePerUnit,
            recipientAllowlistProof,
          },
        }),
        overrides: {
          erc20Value,
          value,
        },
        to: getAddress(options.to),
        tokenId: options.tokenId,
      };
    },
    contract: options.contract,
  });
}

export const encodeMintParams = encodeBytesBeforeMintERC1155Params;
