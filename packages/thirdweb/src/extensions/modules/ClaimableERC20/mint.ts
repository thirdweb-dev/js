import { encodePacked, getAddress, keccak256 } from "viem";
import { isNativeTokenAddress } from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type Hex, padHex } from "../../../utils/encoding/hex.js";
import { encodeBytesBeforeMintERC20Params } from "../__generated__/ClaimableERC20/encode/encodeBytesBeforeMintERC20.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";

export type MintParams = {
  to: string;
  quantity: string | number;
};

/**
 * Mints tokens to a specified address via a ClaimableERC20 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { ClaimableERC20 } from "thirdweb/modules";
 *
 * const transaction = ClaimableERC20.mint({
 *   contract,
 *   to: "0x...", // Address to mint tokens to
 *   quantity: "0.1", // Amount of tokens to mint (in decimals)
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules ClaimableERC20
 */
export function mint(options: BaseTransactionOptions<MintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let amount = 0n;

      const [{ convertErc20Amount }, { getClaimCondition }, { decimals }] =
        await Promise.all([
          import("../../../utils/extensions/convert-erc20-amount.js"),
          import("../__generated__/ClaimableERC20/read/getClaimCondition.js"),
          import("../../erc20/read/decimals.js"),
        ]);
      amount = await convertErc20Amount({
        amount: options.quantity.toString(),
        client: options.contract.client,
        chain: options.contract.chain,
        erc20Address: options.contract.address,
      });

      const [cc, tokenDecimals] = await Promise.all([
        getClaimCondition({ contract: options.contract }),
        decimals({ contract: options.contract }),
      ]);

      const totalPrice =
        (cc.pricePerUnit * amount) / BigInt(10 ** tokenDecimals);
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
              contract: options.contract,
              claimer: options.to,
              merkleTreeUri,
              tokenDecimals,
              async hashEntry(options) {
                return keccak256(
                  encodePacked(
                    ["address"],
                    [getAddress(options.entry.address)],
                  ),
                );
              },
            });
            recipientAllowlistProof = allowlistProof?.proof || [];
          }
        }
      }

      return {
        to: getAddress(options.to),
        amount,
        data: encodeBytesBeforeMintERC20Params({
          params: {
            currency: cc.currency,
            pricePerUnit: cc.pricePerUnit,
            recipientAllowlistProof,
          },
        }),
        overrides: {
          value,
          erc20Value,
        },
      };
    },
  });
}

export const encodeMintParams = encodeBytesBeforeMintERC20Params;
