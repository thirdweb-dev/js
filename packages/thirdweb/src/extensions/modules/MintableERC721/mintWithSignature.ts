import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
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
import {
  type EncodeBytesBeforeMintWithSignatureERC721Params,
  encodeBytesBeforeMintWithSignatureERC721Params,
} from "../__generated__/MintableERC721/encode/encodeBytesBeforeMintWithSignatureERC721.js";

export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature, mintParams } = options;
      return {
        to: payload.to,
        amount: payload.amount,
        baseURI: payload.baseURI,
        data: encodeBytesBeforeMintWithSignatureERC721Params({
          params: mintParams,
        }),
        signature,
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
  const currency = getAddress(mintRequest.currency || NATIVE_TOKEN_ADDRESS);
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

  const mintParams: EncodeBytesBeforeMintWithSignatureERC721Params["params"] = {
    pricePerUnit,
    uid,
    currency,
    startTimestamp: Number(dateToSeconds(startTime)),
    endTimestamp: Number(dateToSeconds(endTime)),
  };
  const payload = {
    to: getAddress(mintRequest.recipient),
    amount: quantity,
    baseURI,
    data: encodeBytesBeforeMintWithSignatureERC721Params({
      params: mintParams,
    }),
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
  return { payload, signature, mintParams };
}

type GeneratePayloadInput = {
  recipient: string;
  currency?: string;
  pricePerUnit?: bigint;
  uid?: Hex;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
};

export const MintRequestERC721 = [
  { type: "address", name: "to" },
  { type: "uint256", name: "amount" },
  { type: "string", name: "baseURI" },
  { type: "bytes", name: "data" },
] as const;
