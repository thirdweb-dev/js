import type { AbiParameterToPrimitiveType } from "abitype";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { mint as generatedMint } from "../__generated__/ERC1155Core/write/mint.js";
import { encodeBytesBeforeMintERC1155Params } from "../__generated__/MintableERC1155/encode/encodeBytesBeforeMintERC1155.js";

export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature, metadataURI } = options;
      return {
        to: payload.recipient,
        tokenId: payload.tokenId,
        value: payload.quantity,
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
  quantity: bigint;
  tokenId: bigint; // TODO (modular) this should be optional
  currency?: Address;
  pricePerUnit?: bigint;
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
