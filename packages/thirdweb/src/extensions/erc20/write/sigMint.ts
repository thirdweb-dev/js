import type { AbiParameterToPrimitiveType } from "abitype";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { toUnits } from "../../../utils/units.js";
import { randomBytes32 } from "../../../utils/uuid.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { name } from "../../common/read/name.js";
import { decimals } from "../../erc20/read/decimals.js";
import { mintWithSignature as generatedMintWithSignature } from "../__generated__/ISignatureMintERC20/write/mintWithSignature.js";

/**
 * Mints a new ERC20 token with the given minter signature
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc20";
 *
 * const { payload, signature } = await generateMintSignature(...)
 *
 * const transaction = mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 * await sendTransaction({ transaction, account });
 * ```
 * @extension ERC20
 * @returns A promise that resolves to the transaction result.
 */
export const mintWithSignature = generatedMintWithSignature;

export type GenerateMintSignatureOptions = {
  account: Account;
  contract: ThirdwebContract;
  mintRequest: GeneratePayloadInput;
};

/**
 * Generates the payload and signature for minting an ERC20 token.
 * @param options - The options for the minting process.
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc20";
 *
 * const { payload, signature } = await generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     to: "0x...",
 *     quantity: 10n,
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
 * @extension ERC20
 * @returns A promise that resolves to the payload and signature.
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  let priceInWei = 0n;
  const d = await decimals(options).catch(() => 18);
  if (mintRequest.price) {
    priceInWei = toUnits(mintRequest.price.toString(), d);
  }

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const uid = mintRequest.uid || (await randomBytes32());
  const amountWithDecimals = toUnits(mintRequest.quantity.toString(), d);

  const payload: PayloadType = {
    quantity: amountWithDecimals,
    to: mintRequest.to,
    primarySaleRecipient: mintRequest.primarySaleRecipient || account.address,
    price: priceInWei,
    currency: mintRequest.currency || NATIVE_TOKEN_ADDRESS,
    validityStartTimestamp: dateToSeconds(startTime),
    validityEndTimestamp: dateToSeconds(endTime),
    uid: uid as Hex,
  };

  // ERC20Permit (EIP-712) spec differs from signature mint 721, 1155.
  // it uses the token name in the domain separator
  const tokenName = await name({
    contract,
  });

  const signature = await account.signTypedData({
    domain: {
      name: tokenName,
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequest: MintRequest20 },
    primaryType: "MintRequest",
    message: payload,
  });
  return { payload, signature };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequest20;
}>;

type GeneratePayloadInput = {
  to: string;
  quantity: string | number;
  primarySaleRecipient?: string;
  price?: number | string;
  currency?: string;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  uid?: string;
};

export const MintRequest20 = [
  { name: "to", type: "address" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
] as const;
