import { maxUint256 } from "ox/Solidity";
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

/**
 * Mints ERC1155 tokens to a specified address with a signature via a MintableERC1155 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC1155 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC1155.generateMintSignature({
 *   account,
 *   contract,
 *   nft: {
 *     name: "My NFT",
 *     description: "This is my NFT",
 *     image: "ipfs://...",
 *   },
 *   mintRequest: {
 *     recipient: "0x...",
 *     quantity: "10",
 *   },
 * });
 *
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC1155.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC1155
 */
export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    asyncParams: async () => {
      const { payload, signature } = options;
      return {
        amount: payload.amount,
        baseURI: payload.baseURI,
        data: payload.data,
        signature,
        to: payload.to,
        tokenId: payload.tokenId,
      };
    },
    contract: options.contract,
  });
}

export type GenerateMintSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  nft: NFTInput | string;
  mintRequest: GeneratePayloadInput;
};

/**
 * Generates a payload and signature for minting ERC1155 tokens with a signature.
 * @param options The options for generating the payload and signature.
 * @returns The payload and signature.
 * @example
 * ```typescript
 * import { MintableERC1155 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC1155.generateMintSignature({
 *   account,
 *   contract,
 *   nft: {
 *     name: "My NFT",
 *     description: "This is my NFT",
 *     image: "ipfs://...",
 *   },
 *   mintRequest: {
 *     recipient: "0x...",
 *     quantity: "10",
 *   },
 * });
 *
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC1155.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC1155
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
      currency,
      endTimestamp: Number(dateToSeconds(endTime)),
      pricePerUnit,
      startTimestamp: Number(dateToSeconds(startTime)),
      uid,
    };

  const payload = {
    amount: mintRequest.quantity,
    baseURI: metadataURI,
    data: encodeBytesBeforeMintWithSignatureERC1155Params({
      params: mintParams,
    }),
    to: mintRequest.recipient,
    tokenId: mintRequest.tokenId ?? maxUint256,
  };

  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: "ERC1155Core",
      verifyingContract: contract.address as Hex,
      version: "1",
    },
    message: payload,
    primaryType: "MintRequestERC1155",
    types: { MintRequestERC1155: MintRequestERC1155 },
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

const MintRequestERC1155 = [
  { name: "to", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "amount", type: "uint256" },
  { name: "baseURI", type: "string" },
  { name: "data", type: "bytes" },
] as const;
