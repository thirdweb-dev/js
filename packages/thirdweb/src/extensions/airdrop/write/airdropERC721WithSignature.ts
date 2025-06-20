import type { AbiParameterToPrimitiveType, Address } from "abitype";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { airdropERC721WithSignature as generatedAirdropERC721WithSignature } from "../__generated__/Airdrop/write/airdropERC721WithSignature.js";

/**
 * Airdrops ERC721 tokens to a list of recipients, with the request signed by admin
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { airdropERC721WithSignature, generateAirdropSignatureERC721 } from "thirdweb/extensions/airdrop";
 * import { sendTransaction } from "thirdweb";
 *
 * const { req, signature } = await generateAirdropSignatureERC721(...)
 *
 * const transaction = airdropERC721WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension AIRDROP
 * @returns A promise that resolves to the transaction result.
 */
export const airdropERC721WithSignature = generatedAirdropERC721WithSignature;

/**
 * @extension AIRDROP
 */
export type GenerateAirdropERC721SignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  airdropRequest: GenerateReqInput;
};

/**
 * Generates the req and signature for sending ERC721 airdrop.
 * @param options - The options for the airdrop.
 * @example
 * ```ts
 * import { airdropERC721WithSignature, generateAirdropSignatureERC721 } from "thirdweb/extensions/airdrop";
 *
 * // list of recipients and tokenIds to airdrop for each recipient
 * const contents = [
 *    { recipient: "0x...", tokenId: 0 },
 *    { recipient: "0x...", tokenId: 1 },
 *    { recipient: "0x...", tokenId: 2 },
 *  ];
 *
 * const { req, signature } = await generateAirdropSignatureERC721({
 *   account,
 *   contract,
 *   airdropRequest: {
 *     tokenAddress: "0x...", // address of the ERC721 token to airdrop
 *     contents
 *   },
 * });
 *
 * const transaction = airdropERC721WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension AIRDROP
 * @returns A promise that resolves to the req and signature.
 */
export async function generateAirdropSignatureERC721(
  options: GenerateAirdropERC721SignatureOptions,
) {
  const { airdropRequest, account, contract } = options;
  const tokenAddress = airdropRequest.tokenAddress;
  const contents = airdropRequest.contents;
  const uid = airdropRequest.uid || (await randomBytesHex());
  const endTime = airdropRequest.expirationTimestamp || tenYearsFromNow();

  const req: ReqType = {
    contents,
    expirationTimestamp: dateToSeconds(endTime),
    tokenAddress,
    uid,
  };

  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: "Airdrop",
      verifyingContract: contract.address as Hex,
      version: "1",
    },
    message: req,
    primaryType: "AirdropRequestERC721",
    types: { AirdropContentERC721, AirdropRequestERC721 },
  });
  return { req, signature };
}

type ContentType = AbiParameterToPrimitiveType<{
  type: "tuple[]";
  name: "contents";
  components: typeof AirdropContentERC721;
}>;

type ReqType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "req";
  components: [
    { name: "uid"; type: "bytes32"; internalType: "bytes32" },
    { name: "tokenAddress"; type: "address"; internalType: "address" },
    { name: "expirationTimestamp"; type: "uint256"; internalType: "uint256" },
    {
      name: "contents";
      type: "tuple[]";
      components: [
        { name: "recipient"; type: "address"; internalType: "address" },
        { name: "tokenId"; type: "uint256"; internalType: "uint256" },
      ];
    },
  ];
}>;

type GenerateReqInput = {
  uid?: Hex;
  tokenAddress: Address;
  expirationTimestamp?: Date;
  contents: ContentType;
};

const AirdropContentERC721 = [
  { name: "recipient", type: "address" },
  { name: "tokenId", type: "uint256" },
] as const;

const AirdropRequestERC721 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC721[]" },
] as const;
