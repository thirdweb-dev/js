import type { AbiParameterToPrimitiveType, Address } from "abitype";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { airdropERC20WithSignature as generatedAirdropERC20WithSignature } from "../__generated__/Airdrop/write/airdropERC20WithSignature.js";

/**
 * Airdrops ERC20 tokens to a list of recipients, with the request signed by admin
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { airdropERC20WithSignature, generateAirdropSignatureERC20 } from "thirdweb/extensions/airdrop";
 *
 * const { req, signature } = await generateAirdropSignatureERC20(...)
 *
 * const transaction = airdropERC20WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the transaction result.
 */
export const airdropERC20WithSignature = generatedAirdropERC20WithSignature;

export type GenerateAirdropERC20SignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  airdropRequest: GenerateReqInput;
};

/**
 * Generates the req and signature for sending ERC20 airdrop.
 * @param options - The options for the airdrop.
 * @example
 * ```ts
 * import { airdropERC20WithSignature, generateAirdropSignatureERC20 } from "thirdweb/extensions/airdrop";
 *
 * // list of recipients and amounts to airdrop for each recipient
 * const contents = [
 *    { recipient: "0x...", amount: 10n }, // amount in wei
 *    { recipient: "0x...", amount: 15n }, // amount in wei
 *    { recipient: "0x...", amount: 20n }, // amount in wei
 *  ];
 *
 * const { req, signature } = await generateAirdropSignatureERC20({
 *   account,
 *   contract,
 *   airdropRequest: {
 *     tokenAddress: "0x...", // address of the ERC20 token to airdrop
 *     contents
 *   },
 * });
 *
 * const transaction = airdropERC20WithSignature({
 *   contract,
 *   req,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the req and signature.
 */
export async function generateAirdropSignatureERC20(
  options: GenerateAirdropERC20SignatureOptions,
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
    types: { AirdropRequestERC20, AirdropContentERC20 },
    primaryType: "AirdropRequestERC20",
    message: req,
  });
  return { req, signature };
}

type ContentType = AbiParameterToPrimitiveType<{
  type: "tuple[]";
  name: "contents";
  components: typeof AirdropContentERC20;
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

export const AirdropContentERC20 = [
  { name: "recipient", type: "address" },
  { name: "amount", type: "uint256" },
] as const;

export const AirdropRequestERC20 = [
  { name: "uid", type: "bytes32" },
  { name: "tokenAddress", type: "address" },
  { name: "expirationTimestamp", type: "uint256" },
  { name: "contents", type: "AirdropContentERC20[]" },
] as const;
