import type { AbiParameterToPrimitiveType, Address } from "abitype";
import { type Hex, isHex, stringToHex } from "viem";
import {
  isNativeTokenAddress,
  NATIVE_TOKEN_ADDRESS,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { toBigInt } from "../../../utils/bigint.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import {
  mintWithSignature as generatedMintWithSignature,
  type MintWithSignatureParams,
} from "../__generated__/ISignatureMintERC721/write/mintWithSignature.js";
import {
  mintWithSignature as generatedMintWithSignatureV2,
  type MintWithSignatureParams as MintWithSignatureParamsV2,
} from "../__generated__/ISignatureMintERC721_v2/write/mintWithSignature.js";

/**
 * Mints a new ERC721 token with the given minter signature
 * This method is only available on the `TokenERC721` contract.
 *
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc721";
 * import { sendTransaction } from "thirdweb";
 *
 * const { payload, signature } = await generateMintSignature(...)
 *
 * const transaction = mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC721
 * @returns A promise that resolves to the transaction result.
 */
export function mintWithSignature(
  options: BaseTransactionOptions<
    | { payload: PayloadTypeV2; signature: Hex }
    | { payload: PayloadType; signature: Hex }
  >,
) {
  const { payload } = options;
  if ("quantity" in payload) {
    return mintWithSignatureV2(
      options as BaseTransactionOptions<MintWithSignatureParamsV2>,
    );
  }
  return mintWithSignatureV1(
    options as BaseTransactionOptions<MintWithSignatureParams>,
  );
}

function mintWithSignatureV1(
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

function mintWithSignatureV2(
  options: BaseTransactionOptions<MintWithSignatureParamsV2>,
) {
  const value = isNativeTokenAddress(options.payload.currency)
    ? options.payload.pricePerToken * options.payload.quantity
    : 0n;
  return generatedMintWithSignatureV2({
    ...options,
    overrides: {
      value,
    },
  });
}

export type GenerateMintSignatureOptions<
  T extends "LoyaltyCard" | "TokenERC721" = "TokenERC721",
> = {
  account: Account;
  contract: ThirdwebContract;
  mintRequest: GeneratePayloadInput;
  contractType?: T;
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
export async function generateMintSignature<
  T extends "LoyaltyCard" | "TokenERC721" = "TokenERC721",
>(options: GenerateMintSignatureOptions<T>): Promise<SignPayloadResult<T>> {
  const { mintRequest, account, contract, contractType } = options;

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
          chain: contract.chain,
          client: contract.client,
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
    ((): Hex => {
      if (mintRequest.uid) {
        return isHex(mintRequest.uid)
          ? mintRequest.uid
          : stringToHex(mintRequest.uid, { size: 32 });
      }
      return randomBytesHex();
    })(),
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

  if (contractType === "LoyaltyCard") {
    return signPayloadV2({
      account,
      contract,
      currency,
      endTime,
      mintRequest,
      price,
      primarySaleRecipient: saleRecipient,
      royaltyRecipient,
      startTime,
      uid,
      uri,
    }) as Promise<SignPayloadResult<T>>;
  }
  return signPayloadV1({
    account,
    contract,
    currency,
    endTime,
    mintRequest,
    price,
    primarySaleRecipient: saleRecipient,
    royaltyRecipient,
    startTime,
    uid,
    uri,
  }) as Promise<SignPayloadResult<T>>;
}

async function signPayloadV1({
  mintRequest,
  account,
  contract,
  uri,
  currency,
  uid,
  price,
  royaltyRecipient,
  primarySaleRecipient,
  startTime,
  endTime,
}: {
  mintRequest: GeneratePayloadInput;
  account: Account;
  contract: ThirdwebContract;
  uri: string;
  currency: Address;
  uid: Hex;
  price: bigint;
  royaltyRecipient: Address;
  primarySaleRecipient: Address;
  startTime: Date;
  endTime: Date;
}): Promise<{ payload: PayloadType; signature: Hex }> {
  const payload: PayloadType = {
    currency,
    price,
    primarySaleRecipient,
    royaltyBps: toBigInt(mintRequest.royaltyBps || 0),
    royaltyRecipient,
    to: mintRequest.to,
    uid,
    uri,
    validityEndTimestamp: dateToSeconds(endTime),
    validityStartTimestamp: dateToSeconds(startTime),
  };

  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: "TokenERC721",
      verifyingContract: contract.address,
      version: "1",
    },
    message: payload,
    primaryType: "MintRequest",
    types: {
      MintRequest: MintRequest721,
    },
  });
  return { payload, signature };
}

async function signPayloadV2({
  mintRequest,
  account,
  contract,
  uri,
  currency,
  uid,
  price,
  royaltyRecipient,
  primarySaleRecipient,
  startTime,
  endTime,
}: {
  mintRequest: GeneratePayloadInput;
  account: Account;
  contract: ThirdwebContract;
  uri: string;
  currency: Address;
  uid: Hex;
  price: bigint;
  royaltyRecipient: Address;
  primarySaleRecipient: Address;
  startTime: Date;
  endTime: Date;
}): Promise<{ payload: PayloadTypeV2; signature: Hex }> {
  const payload: PayloadTypeV2 = {
    currency,
    pricePerToken: price,
    primarySaleRecipient,
    quantity: toBigInt(1), // always 1 for 721 NFTs
    royaltyBps: toBigInt(mintRequest.royaltyBps || 0),
    royaltyRecipient,
    to: mintRequest.to,
    uid,
    uri,
    validityEndTimestamp: dateToSeconds(endTime),
    validityStartTimestamp: dateToSeconds(startTime),
  };

  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: "SignatureMintERC721",
      verifyingContract: contract.address,
      version: "1",
    },
    message: payload,
    primaryType: "MintRequest",
    types: {
      MintRequest: MintRequest721_V2,
    },
  });
  return { payload, signature };
}

type SignPayloadResult<T> = T extends "LoyaltyCard"
  ? Awaited<ReturnType<typeof signPayloadV2>>
  : Awaited<ReturnType<typeof signPayloadV1>>;

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequest721;
}>;

type PayloadTypeV2 = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequest721_V2;
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
  uid?: string;
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

// used for LoyaltyCard contract and base sigmint contracts
// adds quantity to the payload so its the same as 1155
const MintRequest721_V2 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "uri", type: "string" },
  { name: "quantity", type: "uint256" },
  { name: "pricePerToken", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
] as const;
