import type { AbiParameterToPrimitiveType, Address } from "abitype";
import {
  NATIVE_TOKEN_ADDRESS,
  isNativeTokenAddress,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { name } from "../../common/read/name.js";
import {
  type MintWithSignatureParams,
  mintWithSignature as generatedMintWithSignature,
} from "../__generated__/ISignatureMintERC20/write/mintWithSignature.js";

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
export function mintWithSignature(
  options: BaseTransactionOptions<MintWithSignatureParams>,
) {
  const value = isNativeTokenAddress(options.payload.currency)
    ? options.payload.price
    : 0n;
  return generatedMintWithSignature({
    ...options,
    overrides: {
      value,
    },
  });
}

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
 * @extension ERC20
 * @returns A promise that resolves to the payload and signature.
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  const currency = mintRequest.currency || NATIVE_TOKEN_ADDRESS;
  const [price, quantity, uid, tokenName] = await Promise.all([
    // price per token in wei
    (async () => {
      // if priceInWei is provided, use it
      if ("priceInWei" in mintRequest && mintRequest.priceInWei) {
        return mintRequest.priceInWei;
      }
      // if price is provided, convert it to wei
      if ("price" in mintRequest && mintRequest.price) {
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        return await convertErc20Amount({
          amount: mintRequest.price,
          client: contract.client,
          chain: contract.chain,
          erc20Address: currency,
        });
      }
      // if neither price nor priceInWei is provided, default to 0
      return 0n;
    })(),
    // quantity in wei
    (async () => {
      // if the quantity is already passed in wei, use it
      if ("quantityWei" in mintRequest) {
        return mintRequest.quantityWei;
      }
      // otherwise convert the quantity to wei using the contract's OWN decimals
      const { convertErc20Amount } = await import(
        "../../../utils/extensions/convert-erc20-amount.js"
      );
      return await convertErc20Amount({
        amount: mintRequest.quantity,
        client: contract.client,
        chain: contract.chain,
        erc20Address: contract.address,
      });
    })(),
    // uid computation
    mintRequest.uid || (await randomBytesHex()),
    // ERC20Permit (EIP-712) spec differs from signature mint 721, 1155.
    // it uses the token name in the domain separator
    name({
      contract,
    }),
  ]);

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const payload: PayloadType = {
    price,
    quantity,
    uid,
    currency,
    to: mintRequest.to,
    primarySaleRecipient: mintRequest.primarySaleRecipient || account.address,
    validityStartTimestamp: dateToSeconds(startTime),
    validityEndTimestamp: dateToSeconds(endTime),
  };

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
  primarySaleRecipient?: Address;
  price?: string;
  priceInWei?: bigint;
  currency?: Address;
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  uid?: Hex;
} & ({ quantity: string } | { quantityWei: bigint });

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
