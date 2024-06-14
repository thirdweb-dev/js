import type { AbiParameterToPrimitiveType, Address } from "abitype";
import type { Hex } from "viem";
import {
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toBigInt } from "../../../utils/bigint.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  type MintWithSignatureParams,
  mintWithSignature as generatedMintWithSignature,
} from "../__generated__/ISignatureMintERC721/write/mintWithSignature.js";

/**
 * Mints a new ERC721 token with the given minter signature
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc721";
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
 * @extension ERC721
 * @returns A promise that resolves to the transaction result.
 */
export function mintWithSignature(
  options: BaseTransactionOptions<MintWithSignatureParams>,
) {
  const value = isNativeTokenAddress(options.payload.currency)
    ? options.payload.price
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
};

/**
 * Generates the payload and signature for minting an ERC721 token.
 * @param options - The options for the minting process.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc721";
 *
 * const { payload, signature } = await generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     to: "0x...",
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
 * @extension ERC721
 * @returns A promise that resolves to the payload and signature.
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;

  const currency = mintRequest.currency || NATIVE_TOKEN_ADDRESS;
  const [price, uri, uid] = await Promise.all([
    // price per token in wei
    (async () => {
      // if priceInWei is provided, use it
      if ("priceInWei" in mintRequest && mintRequest.priceInWei) {
        return mintRequest.priceInWei;
      }
      // if price is provided, convert it to wei
      if ("price" in mintRequest && mintRequest.price) {
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        return await convertErc20Amount({
          amount: mintRequest.price,
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

  let saleRecipient: Address;
  if (
    mintRequest.primarySaleRecipient?.length === 0 ||
    !mintRequest.primarySaleRecipient
  ) {
    const { primarySaleRecipient } = await import(
      "../../common/__generated__/IPrimarySale/read/primarySaleRecipient.js"
    );
    saleRecipient = await primarySaleRecipient({
      contract,
    });
  } else {
    saleRecipient = mintRequest.primarySaleRecipient;
  }

  let royaltyRecipient: Address;
  if (
    mintRequest.royaltyRecipient?.length === 0 ||
    !mintRequest.royaltyRecipient
  ) {
    const { getDefaultRoyaltyInfo } = await import(
      "../../common/__generated__/IRoyalty/read/getDefaultRoyaltyInfo.js"
    );
    const royaltyInfo = await getDefaultRoyaltyInfo({
      contract,
    });
    royaltyRecipient = royaltyInfo[0];
  } else {
    royaltyRecipient = mintRequest.royaltyRecipient;
  }

  const payload: PayloadType = {
    uri,
    currency,
    uid,
    price,
    to: mintRequest.to,
    royaltyRecipient: royaltyRecipient,
    royaltyBps: toBigInt(mintRequest.royaltyBps || 0),
    primarySaleRecipient: saleRecipient,
    validityStartTimestamp: dateToSeconds(startTime),
    validityEndTimestamp: dateToSeconds(endTime),
  };

  const signature = await account.signTypedData({
    domain: {
      name: "TokenERC721",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address,
    },
    types: { MintRequest: MintRequest721 },
    primaryType: "MintRequest",
    message: payload,
  });
  return { payload, signature };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequest721;
}>;

type GeneratePayloadInput = {
  to: string;
  metadata: NFTInput | string;
  royaltyRecipient?: Address;
  royaltyBps?: number;
  primarySaleRecipient?: Address;
  price?: string;
  priceInWei?: bigint;
  currency?: Address;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  uid?: Hex;
};

const MintRequest721 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "uri", type: "string" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
] as const;
