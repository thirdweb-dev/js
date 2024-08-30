import { encodePacked, getAddress, keccak256 } from "viem";
import {
  ZERO_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { type Hex, padHex, toHex } from "../../../utils/encoding/hex.js";
import { encodeBytesBeforeMintERC721Params } from "../__generated__/ClaimableERC721/encode/encodeBytesBeforeMintERC721.js";
import { getClaimCondition } from "../__generated__/ClaimableERC721/read/getClaimCondition.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";

export type MintParams = {
  to: string;
  quantity: string | number;
};

export function mint(options: BaseTransactionOptions<MintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: toHex("", { size: 32 }),
        currency: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        recipient: ZERO_ADDRESS,
      };

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
        quantity: BigInt(options.quantity),
        data: encodeBytesBeforeMintERC721Params({
          params: {
            request: emptyPayload, // TODO (modular) signature claiming
            signature: "0x", // TODO (modular) signature claiming
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

export const encodeMintParams = encodeBytesBeforeMintERC721Params;
