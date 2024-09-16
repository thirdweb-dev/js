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
import { mintWithSignature as generatedMint } from "../__generated__/ERC721Core/write/mintWithSignature.js";
import {
  type EncodeBytesBeforeMintWithSignatureERC721Params,
  encodeBytesBeforeMintWithSignatureERC721Params,
} from "../__generated__/MintableERC721/encode/encodeBytesBeforeMintWithSignatureERC721.js";

/**
 * Mints ERC721 tokens to a specified address with a signature via a MintableERC721 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC721 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC721.generateMintSignature({
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
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC721.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC721
 */
export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature } = options;
      return {
        to: payload.to,
        amount: payload.amount,
        baseURI: payload.baseURI,
        data: payload.data,
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
 * Generates a payload and signature for minting ERC721 tokens via a MintableERC721 module.
 * @param options The options for generating the payload and signature.
 * @returns The payload and signature.
 * @example
 * ```typescript
 * import { MintableERC20 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC721.generateMintSignature({
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
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC20.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC721
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
    baseURI: baseURI,
    data: encodeBytesBeforeMintWithSignatureERC721Params({
      params: mintParams,
    }),
  };

  const signature = await account.signTypedData({
    domain: {
      name: "ERC721Core",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequestERC721: MintRequestERC721 },
    primaryType: "MintRequestERC721",
    message: payload,
  });

  return { payload, signature };
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
