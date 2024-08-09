import type { AbiParameterToPrimitiveType } from "abitype";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { type Hex, padHex } from "../../../utils/encoding/hex.js";
import {
  getBaseUriFromBatch,
  uploadOrExtractURIs,
} from "../../../utils/ipfs.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { startTokenId } from "../../erc721/__generated__/IERC721A/read/startTokenId.js";
import { totalMinted } from "../__generated__/ERC721Core/read/totalMinted.js";
import { mint as generatedMint } from "../__generated__/ERC721Core/write/mint.js";
import { encodeBytesBeforeMintERC721Params } from "../__generated__/MintableERC721/encode/encodeBytesBeforeMintERC721.js";

export type NFTMintParams = {
  to: Address;
  nfts: (NFTInput | string)[];
};

export type NFTSignatureMintParams = {
  to: Address;
  nfts: (NFTInput | string)[];
};

export function mintWithRole(options: BaseTransactionOptions<NFTMintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const start = await startTokenId({ contract: options.contract });
      const minted = await totalMinted({ contract: options.contract });
      const nextIdToMint = start + minted;

      const batchOfUris = await uploadOrExtractURIs(
        options.nfts,
        options.contract.client,
        Number(nextIdToMint),
      );
      const baseURI = getBaseUriFromBatch(batchOfUris);

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: padHex("0x", { size: 32 }),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
        baseURI: "",
      };

      return {
        to: options.to,
        quantity: BigInt(options.nfts.length),
        data: encodeBytesBeforeMintERC721Params({
          params: {
            request: emptyPayload,
            signature: "0x",
            baseURI,
          },
        }),
      };
    },
  });
}

export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature, baseURI } = options;
      return {
        to: payload.recipient,
        quantity: payload.quantity,
        data: encodeBytesBeforeMintERC721Params({
          params: {
            request: payload,
            signature,
            baseURI,
          },
        }),
      };
    },
  });
}

export type GenerateMintSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  nfts: (NFTInput | string)[];
  mintRequest: GeneratePayloadInput;
};

/**
 * Generates the payload and signature for minting an ERC721 token.
 * @param options - The options for the minting process.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/ERC721";
 *
 * const { payload, signature } = await generateMintSignature({
 *   account,
 *   contract,
 *   nfts: [{
 *    name: "My NFT",
 *    description: "My NFT",
 *    image: "https://example.com/image.png",
 *   }],
 *   mintRequest: {
 *     recipient: "0x...",
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
  const quantity = BigInt(options.nfts.length);
  const pricePerUnit = options.mintRequest.pricePerUnit || 0n;
  const uid = options.mintRequest.uid || randomBytesHex();

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const start = await startTokenId({ contract: options.contract });
  const minted = await totalMinted({ contract: options.contract });
  const nextIdToMint = start + minted;

  const batchOfUris = await uploadOrExtractURIs(
    options.nfts,
    options.contract.client,
    Number(nextIdToMint),
  );
  const baseURI = getBaseUriFromBatch(batchOfUris);

  const payload: PayloadType = {
    pricePerUnit,
    quantity,
    uid,
    currency,
    recipient: mintRequest.recipient,
    startTimestamp: Number(dateToSeconds(startTime)),
    endTimestamp: Number(dateToSeconds(endTime)),
    baseURI: baseURI,
  };

  const signature = await account.signTypedData({
    domain: {
      name: "MintableERC721",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequestERC721: MintRequestERC721 },
    primaryType: "MintRequestERC721",
    message: payload,
  });
  return { payload, signature, baseURI };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequestERC721;
}>;

type GeneratePayloadInput = {
  recipient: Address;
  currency?: Address;
  pricePerUnit?: bigint;
  uid?: Hex;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
};

export const MintRequestERC721 = [
  { name: "startTimestamp", type: "uint48" },
  { name: "endTimestamp", type: "uint48" },
  { name: "recipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "pricePerUnit", type: "uint256" },
  { name: "baseURI", type: "string" },
  { name: "uid", type: "bytes32" },
] as const;
