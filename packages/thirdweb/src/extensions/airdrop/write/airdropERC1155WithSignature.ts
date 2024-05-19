import type { AbiParameterToPrimitiveType, Address } from "abitype";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { airdropERC1155WithSignature as generatedAirdropERC1155WithSignature } from "../__generated__/Airdrop/write/airdropERC1155WithSignature.js";

/**
 * Airdrops ERC1155 tokens to a list of recipients, with the request signed by admin
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { airdropERC1155WithSignature, generateAirdropSignatureERC1155 } from "thirdweb/extensions/airdrop";
 *
 * const { req, signature } = await generateAirdropSignatureERC1155(...)
 *
 * const transaction = airdropERC1155WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the transaction result.
 */
export const airdropERC1155WithSignature = generatedAirdropERC1155WithSignature;

export type GenerateAirdropERC1155SignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  airdropRequest: GenerateReqInput;
};

/**
 * Generates the req and signature for sending ERC1155 airdrop.
 * @param options - The options for the airdrop.
 * @example
 * ```ts
 * import { airdropERC1155WithSignature, generateAirdropSignatureERC1155 } from "thirdweb/extensions/airdrop";
 *
 * // list of recipients, tokenIds and amounts to airdrop for each recipient
 * const contents = [
 *    { recipient: "0x...", tokenId: 0, amount: 10n },
 *    { recipient: "0x...", tokenId: 0, amount: 15n },
 *    { recipient: "0x...", tokenId: 0, amount: 20n },
 *  ];
 *
 * const { req, signature } = await generateAirdropSignatureERC1155({
 *   account,
 *   contract,
 *   airdropRequest: {
 *     tokenAddress: "0x...", // address of the ERC1155 token to airdrop
 *     contents
 *   },
 * });
 *
 * const transaction = airdropERC1155WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the req and signature.
 */
export async function generateAirdropSignatureERC1155(
  options: GenerateAirdropERC1155SignatureOptions,
) {
  const { airdropRequest, account, contract } = options;
  const tokenAddress = airdropRequest.tokenAddress;
  const contents = airdropRequest.contents;
  const uid = airdropRequest.uid || (await randomBytesHex());
  const endTime = airdropRequest.expirationTimestamp || tenYearsFromNow();

  const req: ReqType = {
    uid,
    tokenAddress,
    expirationTimestamp: dateToSeconds(endTime),
    contents,
  };

  const signature = await account.signTypedData({
    domain: {
      name: "Airdrop",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { AirdropRequestERC1155, AirdropContentERC1155 },
    primaryType: "AirdropRequestERC1155",
    message: req,
  });
  return { req, signature };
}

type ContentType = AbiParameterToPrimitiveType<{
  type: "tuple[]";
  name: "contents";
  components: typeof AirdropContentERC1155;
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
      internalType: "struct Airdrop.AirdropContentERC1155[]";
      components: [
        { name: "recipient"; type: "address"; internalType: "address" },
        { name: "tokenId"; type: "uint256"; internalType: "uint256" },
        { name: "amount"; type: "uint256"; internalType: "uint256" },
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

export const AirdropContentERC1155 = [
  { name: "recipient", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "amount", type: "uint256" },
] as const;

export const AirdropRequestERC1155 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC1155[]" },
] as const;
