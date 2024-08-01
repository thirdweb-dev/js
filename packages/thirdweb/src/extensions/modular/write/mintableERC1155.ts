import type { AbiParameterToPrimitiveType } from "abitype";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";
import { encodeBytesBeforeMintERC1155Params } from "../__generated__/MintableERC1155/encode/encodeBytesBeforeMintERC1155.js";

export type EditionMintParams = {
  to: Address;
  tokenId: bigint;
  amount: bigint;
  nft: NFTInput | string;
};

export type NFTSignatureMintParams = {
  to: Address;
  nfts: (NFTInput | string)[];
};

export function mintWithPermissions(
  options: BaseTransactionOptions<EditionMintParams>,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const batchOfUris = await uploadOrExtractURIs(
        [options.nft],
        options.contract.client,
        0,
      );

      const baseURI = getBaseUriFromBatch(batchOfUris);

      const emptyPayload = {
        tokenId: options.tokenId,
        pricePerUnit: 0n,
        quantity: 0n,
        uid: randomBytesHex(),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        metadataURI: "",
      };

      return {
        to: options.to,
        tokenId: options.tokenId,
        value: options.amount,
        data: encodeBytesBeforeMintERC1155Params({
          params: {
            request: emptyPayload,
            signature: "0x",
            metadataURI: `${baseURI}0`,
          },
        }),
      };
    },
  });
}

export function mintWithSignature(
  options: BaseTransactionOptions<GenerateMintSignatureOptions>,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature, metadataURI } =
        await generateMintSignature(options);

      return {
        to: payload.recipient,
        tokenId: payload.tokenId,
        value: BigInt(payload.quantity),
        data: encodeBytesBeforeMintERC1155Params({
          params: {
            request: payload,
            signature,
            metadataURI,
          },
        }),
      };
    },
  });
}

export type GenerateMintSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  nft: NFTInput | string;
  mintRequest: GeneratePayloadInput;
};

/**
 * Generates the payload and signature for minting an ERC1155 token.
 * @param options - The options for the minting process.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/ERC1155";
 *
 * const { payload, signature } = await generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     recipient: "0x...",
 *     quantity: "10",
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
  const [pricePerUnit, uid] = await Promise.all([
    // price per token in wei
    (async () => {
      // if priceInWei is provided, use it
      if ("priceInWei" in mintRequest && mintRequest.priceInWei) {
        return mintRequest.priceInWei;
      }

      // if neither price nor priceInWei is provided, default to 0
      return 0n;
    })(),
    // uid computation
    mintRequest.uid || (await randomBytesHex()),
  ]);

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const batchOfUris = await uploadOrExtractURIs(
    [options.nft],
    options.contract.client,
    0,
  );

  const metadataURI = `${getBaseUriFromBatch(batchOfUris)}0`;

  const payload: PayloadType = {
    pricePerUnit,
    uid,
    currency,
    tokenId: mintRequest.tokenId,
    recipient: mintRequest.recipient,
    quantity: mintRequest.quantity,
    startTimestamp: Number(dateToSeconds(startTime)),
    endTimestamp: Number(dateToSeconds(endTime)),
    metadataURI: metadataURI,
  };

  const signature = await account.signTypedData({
    domain: {
      name: "MintableERC1155",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequestERC1155: MintRequestERC1155 },
    primaryType: "MintRequestERC1155",
    message: payload,
  });
  return { payload, signature, metadataURI };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequestERC1155;
}>;

type GeneratePayloadInput = {
  recipient: Address;
  tokenId: bigint;
  quantity: bigint;
  currency?: Address;
  priceInWei?: bigint;
  uid?: Hex;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
};

export const MintRequestERC1155 = [
  { name: "tokenId", type: "uint256" },
  { name: "startTimestamp", type: "uint48" },
  { name: "endTimestamp", type: "uint48" },
  { name: "recipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "pricePerUnit", type: "uint256" },
  { name: "metadataURI", type: "string" },
  { name: "uid", type: "bytes32" },
] as const;
