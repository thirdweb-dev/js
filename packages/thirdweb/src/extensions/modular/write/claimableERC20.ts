import { type Hex, encodePacked, maxUint256 } from "viem";
import {
  NATIVE_TOKEN_ADDRESS,
  ZERO_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import { download } from "../../../storage/download.js";
import { upload } from "../../../storage/upload.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { padHex, toHex } from "../../../utils/encoding/hex.js";
import { processOverrideList } from "../../../utils/extensions/drops/process-override-list.js";
import type { ClaimConditionInput } from "../../../utils/extensions/drops/types.js";
import { keccak256 } from "../../../utils/hashing/keccak256.js";
import { setClaimCondition as generatedSetClaimCondition } from "../__generated__/ClaimableERC20/write/setClaimCondition.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";

export type TokenClaimParams = {
  to: string;
  quantity: string | number;
};

export function claimTo(options: BaseTransactionOptions<TokenClaimParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let amount = 0n;

      const [
        { convertErc20Amount },
        { getClaimCondition },
        { decimals },
        { encodeBytesBeforeMintERC20Params },
      ] = await Promise.all([
        import("../../../utils/extensions/convert-erc20-amount.js"),
        import("../__generated__/ClaimableERC20/read/getClaimCondition.js"),
        import("../../erc20/read/decimals.js"),
        import(
          "../__generated__/ClaimableERC20/encode/encodeBytesBeforeMintERC20.js"
        ),
      ]);
      amount = await convertErc20Amount({
        amount: options.quantity,
        client: options.contract.client,
        chain: options.contract.chain,
        erc20Address: options.contract.address,
      });

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: toHex("", { size: 32 }),
        currency: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        recipient: ZERO_ADDRESS,
      };

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

export function setClaimCondition(
  options: BaseTransactionOptions<ClaimConditionInput>,
) {
  return generatedSetClaimCondition({
    contract: options.contract,
    asyncParams: async () => {
      const { convertErc20Amount } = await import(
        "../../../utils/extensions/convert-erc20-amount.js"
      );
      const startTime = options.startTime || new Date(0);
      const endTime = options.endTime || tenYearsFromNow();
      const [pricePerUnit, availableSupply] = await Promise.all([
        options.pricePerToken
          ? convertErc20Amount({
              chain: options.contract.chain,
              client: options.contract.client,
              erc20Address: options.currencyAddress || NATIVE_TOKEN_ADDRESS,
              amount: options.pricePerToken.toString(),
            })
          : 0n,
        options.maxClaimableSupply
          ? await convertErc20Amount({
              chain: options.contract.chain,
              client: options.contract.client,
              erc20Address: options.contract.address,
              amount: options.maxClaimableSupply.toString(),
            })
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
          tokenDecimals: 18, // unused in this case, we only care
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
        claimCondition: {
          startTimestamp: Number(dateToSeconds(startTime)),
          endTimestamp: Number(dateToSeconds(endTime)),
          pricePerUnit,
          currency: getAddress(options.currencyAddress || NATIVE_TOKEN_ADDRESS),
          availableSupply,
          allowlistMerkleRoot: merkleRoot,
          auxData: metadata, // stores the merkle root and merkle tree uri in IPFS
        },
      };
    },
  });
}
