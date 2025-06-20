import type { AbiParameterToPrimitiveType, Address } from "abitype";
import {
  isNativeTokenAddress,
  NATIVE_TOKEN_ADDRESS,
} from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import { type Hex, isHex, stringToHex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { name } from "../../common/read/name.js";
import {
  mintWithSignature as generatedMintWithSignature,
  type MintWithSignatureParams,
} from "../__generated__/ISignatureMintERC20/write/mintWithSignature.js";

/**
 * Mints a new ERC20 token with the given minter signature
 * This method is only available on the `TokenERC20` contract.
 * @param options - The transaction options.
 * @extension ERC20
 * @example
 * ```ts
 * import { mintWithSignature, generateMintSignature } from "thirdweb/extensions/erc20";
 * import { sendTransaction } from "thirdweb";
 *
 * const { payload, signature } = await generateMintSignature(...)
 *
 * const transaction = mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
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
  const erc20Value =
    !isNativeTokenAddress(options.payload.currency) &&
    options.payload.price > 0n
      ? {
          amountWei: options.payload.price,
          tokenAddress: options.payload.currency,
        }
      : undefined;
  return generatedMintWithSignature({
    ...options,
    overrides: {
      erc20Value,
      value,
    },
  });
}

/**
 * @extension ERC20
 */
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
          chain: contract.chain,
          client: contract.client,
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
        chain: contract.chain,
        client: contract.client,
        erc20Address: contract.address,
      });
    })(),
    ((): Hex => {
      if (mintRequest.uid) {
        return isHex(mintRequest.uid)
          ? mintRequest.uid
          : stringToHex(mintRequest.uid, { size: 32 });
      }
      return randomBytesHex();
    })(),
    // ERC20Permit (EIP-712) spec differs from signature mint 721, 1155.
    // it uses the token name in the domain separator
    name({
      contract,
    }),
  ]);

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const payload: PayloadType = {
    currency,
    price,
    primarySaleRecipient: mintRequest.primarySaleRecipient || account.address,
    quantity,
    to: mintRequest.to,
    uid,
    validityEndTimestamp: dateToSeconds(endTime),
    validityStartTimestamp: dateToSeconds(startTime),
  };

  const signature = await account.signTypedData({
    domain: {
      chainId: contract.chain.id,
      name: tokenName,
      verifyingContract: contract.address as Hex,
      version: "1",
    },
    message: payload,
    primaryType: "MintRequest",
    types: { MintRequest: MintRequest20 },
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
  uid?: string;
} & ({ quantity: string } | { quantityWei: bigint });

const MintRequest20 = [
  { name: "to", type: "address" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
] as const;
