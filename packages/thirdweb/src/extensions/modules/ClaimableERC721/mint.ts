import { encodePacked, getAddress, keccak256 } from "viem";
import { isNativeTokenAddress } from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type Hex, padHex } from "../../../utils/encoding/hex.js";
import { encodeBytesBeforeMintERC721Params } from "../__generated__/ClaimableERC721/encode/encodeBytesBeforeMintERC721.js";
import { getClaimCondition } from "../__generated__/ClaimableERC721/read/getClaimCondition.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";

type MintParams = {
  to: string;
  quantity: string | number;
};

/**
 * Mints ERC721 tokens to a specified address via a ClaimableERC721 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { ClaimableERC721 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC721.mint({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   quantity: 2, // Amount of tokens to mint
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules ClaimableERC721
 */
export function mint(options: BaseTransactionOptions<MintParams>) {
  return generatedMint({
    asyncParams: async () => {
      const cc = await getClaimCondition({ contract: options.contract });

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
        data: encodeBytesBeforeMintERC721Params({
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
      };
    },
    contract: options.contract,
  });
}

export const encodeMintParams = encodeBytesBeforeMintERC721Params;
