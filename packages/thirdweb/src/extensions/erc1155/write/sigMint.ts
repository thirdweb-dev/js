import type { AbiParameterToPrimitiveType, Address } from "abitype";
import { maxUint256 } from "viem";
import {
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toBigInt } from "../../../utils/bigint.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  type MintWithSignatureParams,
  mintWithSignature as generatedMintWithSignature,
} from "../__generated__/ISignatureMintERC1155/write/mintWithSignature.js";

/**
 * Mints a new ERC1155 token with the given minter signature
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc1155";
 *
 * const { payload, signature } = await generateMintSignature(...)
 *
 * const transaction = mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC1155
 * @returns A promise that resolves to the transaction result.
 */
export function mintWithSignature(
  options: BaseTransactionOptions<MintWithSignatureParams>,
) {
  const value = isNativeTokenAddress(options.payload.currency)
    ? options.payload.pricePerToken * options.payload.quantity
    : 0n;
  return generatedMintWithSignature({
    ...options,
    overrides: {
      value,
    },
  });
}

export type GenerateMintSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  mintRequest: GeneratePayloadInput;
  contractType?: "TokenERC1155" | "SignatureMintERC1155";
};

/**
 * Generates the payload and signature for minting an ERC1155 token.
 * @param options - The options for the minting process.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc1155";
 *
 * const { payload, signature } = await generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     to: "0x...",
 *     quantity: 10n,
 *     metadata: {
 *       name: "My NFT",
 *       description: "This is my NFT",
 *       image: "https://example.com/image.png",
 *     },
 *   },
 * });
 *
 * const transaction = mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC1155
 * @returns A promise that resolves to the payload and signature.
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  const currency = mintRequest.currency || NATIVE_TOKEN_ADDRESS;
  const [pricePerToken, uri, uid] = await Promise.all([
    // price per token in wei
    (async () => {
      // if priceInWei is provided, use it
      if ("pricePerTokenWei" in mintRequest && mintRequest.pricePerTokenWei) {
        return mintRequest.pricePerTokenWei;
      }
      // if price is provided, convert it to wei
      if ("pricePerToken" in mintRequest && mintRequest.pricePerToken) {
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        return await convertErc20Amount({
          amount: mintRequest.pricePerToken,
          client: contract.client,
          chain: contract.chain,
          erc20Address: currency,
        });
      }
      // if neither price nor priceInWei is provided, default to 0
      return 0n;
    })(),
    // uri
    (async () => {
      if ("metadata" in mintRequest) {
        if (typeof mintRequest.metadata === "object") {
          // async import the upload function because it is not always required
          const { upload } = await import("../../../storage/upload.js");
          return await upload({
            client: options.contract.client,
            files: [mintRequest.metadata],
          });
        }
        return mintRequest.metadata;
      }
      return "";
    })(),
    // uid computation
    mintRequest.uid || (await randomBytesHex()),
  ]);

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const payload: PayloadType = {
    uri,
    currency,
    uid,
    pricePerToken,
    tokenId:
      "tokenId" in mintRequest && mintRequest.tokenId !== undefined
        ? mintRequest.tokenId
        : maxUint256,
    quantity: mintRequest.quantity,
    to: mintRequest.to,
    royaltyRecipient: mintRequest.royaltyRecipient || account.address,
    royaltyBps: toBigInt(mintRequest.royaltyBps || 0),
    primarySaleRecipient: mintRequest.primarySaleRecipient || account.address,
    validityStartTimestamp: dateToSeconds(startTime),
    validityEndTimestamp: dateToSeconds(endTime),
  };

  const signature = await account.signTypedData({
    domain: {
      name: options.contractType || "TokenERC1155",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequest: MintRequest1155 },
    primaryType: "MintRequest",
    message: payload,
  });
  return { payload, signature };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequest1155;
}>;

type GeneratePayloadInput = {
  to: string;
  quantity: bigint;
  royaltyRecipient?: Address;
  royaltyBps?: number;
  primarySaleRecipient?: Address;
  pricePerToken?: string;
  pricePerTokenWei?: bigint;
  currency?: Address;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  uid?: Hex;
} & (
  | {
      metadata: NFTInput | string;
    }
  | { tokenId: bigint }
);

const MintRequest1155 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "uri", type: "string" },
  { name: "quantity", type: "uint256" },
  { name: "pricePerToken", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
] as const;
