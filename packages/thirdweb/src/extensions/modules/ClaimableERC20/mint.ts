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

      const amountInUnits = amount / BigInt(10 ** tokenDecimals);
      const totalPrice = cc.pricePerUnit * amountInUnits;
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
