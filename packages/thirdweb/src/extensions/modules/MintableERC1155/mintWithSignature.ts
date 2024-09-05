import { maxUint256 } from "viem";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { mintWithSignature as generatedMint } from "../__generated__/ERC1155Core/write/mintWithSignature.js";
import {
  type EncodeBytesBeforeMintWithSignatureERC1155Params,
  encodeBytesBeforeMintWithSignatureERC1155Params,
} from "../__generated__/MintableERC1155/encode/encodeBytesBeforeMintWithSignatureERC1155.js";

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
        tokenId: payload.tokenId,
        baseURI: payload.baseURI,
        amount: payload.amount,
        data: payload.data,
        signature,
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
  const pricePerUnit = options.mintRequest.pricePerUnit || 0n;
  const uid = mintRequest.uid || randomBytesHex();
  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  let metadataURI: string;
  if (typeof options.nft === "string") {
    // if the input is already a string then we just use that
    metadataURI = options.nft;
  } else {
    // otherwise we need to upload the file to the storage server
    // load the upload code if we need it
    const { upload } = await import("../../../storage/upload.js");
    metadataURI = await upload({
      client: options.contract.client,
      files: [options.nft],
    });
  }

  const mintParams: EncodeBytesBeforeMintWithSignatureERC1155Params["params"] =
    {
      pricePerUnit,
      uid,
      currency,
      startTimestamp: Number(dateToSeconds(startTime)),
      endTimestamp: Number(dateToSeconds(endTime)),
    };

  const payload = {
    to: mintRequest.recipient,
    tokenId: mintRequest.tokenId ?? maxUint256,
    amount: mintRequest.quantity,
    baseURI: metadataURI,
    data: encodeBytesBeforeMintWithSignatureERC1155Params({
      params: mintParams,
    }),
  };

  const signature = await account.signTypedData({
    domain: {
      name: "ERC1155Core",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequestERC1155: MintRequestERC1155 },
    primaryType: "MintRequestERC1155",
    message: payload,
  });
  return { payload, signature };
}

type GeneratePayloadInput = {
  recipient: Address;
  quantity: bigint;
  tokenId?: bigint;
  currency?: Address;
  pricePerUnit?: bigint;
  uid?: Hex;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
};

export const MintRequestERC1155 = [
  { type: "address", name: "to" },
  { type: "uint256", name: "tokenId" },
  { type: "uint256", name: "amount" },
  { type: "string", name: "baseURI" },
  { type: "bytes", name: "data" },
] as const;
