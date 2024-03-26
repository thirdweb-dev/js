import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { universalCrypto } from "../../../crypto/aes/lib/universal-crypto.js";
import { toBigInt } from "../../../utils/bigint.js";
import { uint8ArrayToHex } from "../../../utils/encoding/hex.js";
import type { NFTInput } from "../../../utils/nft/parseNft.js";
import { toUnits } from "../../../utils/units.js";
import { decimals } from "../../erc20/read/decimals.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import { mintWithSignature as generatedMintWithSignature } from "../__generated__/ISignatureMintERC721/write/mintWithSignature.js";
import { upload } from "../../../storage/upload.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

/**
 * Mints a new ERC721 token with the given minter signature
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { mintWithSignature } from "thirdweb/extensions/erc721";
 * const tx = await mintWithSignature({
 *   contract,
 *   payload,
 *   signature: "0x...",
 * });
 * ```
 * @extension ERC721
 * @returns A promise that resolves to the transaction result.
 */
export const mintWithSignature = generatedMintWithSignature;

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
 * import { generateMintSignature } from "thirdweb/extensions/erc721";
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
 * ```
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  let priceInWei: bigint = 0n;
  if (mintRequest.price) {
    const d = await decimals(options).catch(() => 18);
    priceInWei = toUnits(mintRequest.price.toString(), d);
  }

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime =
    mintRequest.validityEndTimestamp ||
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10); // 10 years

  const uid =
    mintRequest.uid ||
    uint8ArrayToHex(
      (await universalCrypto()).getRandomValues(new Uint8Array(32)),
    );

  let uri: string;
  if (typeof mintRequest.metadata === "object") {
    uri = (
      await upload({
        client: options.contract.client,
        files: [mintRequest.metadata],
      })
    )[0] as string;
  } else {
    uri = mintRequest.metadata;
  }

  const payload = {
    to: mintRequest.to,
    royaltyRecipient: mintRequest.royaltyRecipient || account.address,
    royaltyBps: toBigInt(mintRequest.royaltyBps || 0),
    primarySaleRecipient: mintRequest.primarySaleRecipient || account.address,
    uri: uri || "",
    price: priceInWei,
    currency: mintRequest.currency || NATIVE_TOKEN_ADDRESS,
    validityStartTimestamp: toBigInt(Math.floor(startTime.getTime() / 1000)),
    validityEndTimestamp: toBigInt(Math.floor(endTime.getTime() / 1000)),
    uid,
  } as PayloadType;

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
  royaltyRecipient?: string;
  royaltyBps?: number;
  primarySaleRecipient?: string;
  price?: number | string;
  currency?: string;
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
