import { encodePacked, getAddress, keccak256 } from "viem";
import { isNativeTokenAddress } from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type Hex, padHex } from "../../../utils/encoding/hex.js";
import { encodeBytesBeforeMintERC1155Params } from "../__generated__/ClaimableERC1155/encode/encodeBytesBeforeMintERC1155.js";
import { getClaimConditionByTokenId } from "../__generated__/ClaimableERC1155/read/getClaimConditionByTokenId.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";

export type MintParams = {
  to: string;
  tokenId: bigint;
  quantity: string | number;
};

export function mint(options: BaseTransactionOptions<MintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const cc = await getClaimConditionByTokenId({
        contract: options.contract,
        id: options.tokenId,
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
              contract: options.contract,
              claimer: options.to,
              merkleTreeUri,
              tokenDecimals: 18, // unused here
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
        tokenId: options.tokenId,
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
          value,
          erc20Value,
        },
      };
    },
  });
}

export const encodeMintParams = encodeBytesBeforeMintERC1155Params;
