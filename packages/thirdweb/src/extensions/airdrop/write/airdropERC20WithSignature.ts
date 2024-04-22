import type { AbiParameterToPrimitiveType, Address } from "abitype";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytes32 } from "../../../utils/uuid.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { airdropERC20WithSignature as generatedAirdropERC20WithSignature } from "../__generated__/Airdrop/write/airdropERC20WithSignature.js";

export const airdropERC20WithSignature = generatedAirdropERC20WithSignature;

export type GenerateAirdropSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  airdropRequest: GenerateReqInput;
};

export async function generateAirdropSignature(
  options: GenerateAirdropSignatureOptions,
) {
  const { airdropRequest, account, contract } = options;
  const tokenAddress = airdropRequest.tokenAddress;
  const contents = airdropRequest.contents;
  const uid = airdropRequest.uid || (await randomBytes32());

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
