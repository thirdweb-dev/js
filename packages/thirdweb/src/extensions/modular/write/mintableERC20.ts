import type { AbiParameterToPrimitiveType } from "abitype";
import { ZERO_ADDRESS } from "../../../constants/addresses.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { mint as generatedMint } from "../__generated__/ERC20Core/write/mint.js";
import { encodeBytesBeforeMintERC20Params } from "../__generated__/MintableERC20/encode/encodeBytesBeforeMintERC20.js";

export type TokenMintParams = {
  to: string;
} & ({ quantity: string } | { quantityWei: bigint });

export function mintWithRole(options: BaseTransactionOptions<TokenMintParams>) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      let amount = 0n;

      // if the quantity is already passed in wei, use it
      if ("quantityWei" in options) {
        amount = options.quantityWei;
      } else if ("quantity" in options) {
        // otherwise convert the quantity to wei using the contract's OWN decimals
        const { convertErc20Amount } = await import(
          "../../../utils/extensions/convert-erc20-amount.js"
        );
        amount = await convertErc20Amount({
          amount: options.quantity,
          client: options.contract.client,
          chain: options.contract.chain,
          erc20Address: options.contract.address,
        });
      }

      const emptyPayload = {
        pricePerUnit: 0n,
        quantity: 0n,
        uid: randomBytesHex(),
        currency: ZERO_ADDRESS,
        recipient: ZERO_ADDRESS,
        startTimestamp: 0,
        endTimestamp: 0,
      };

      return {
        to: options.to,
        amount: BigInt(amount),
        data: encodeBytesBeforeMintERC20Params({
          params: {
            request: emptyPayload,
            signature: "0x",
          },
        }),
      };
    },
  });
}

export function mintWithSignature(
  options: BaseTransactionOptions<
    Awaited<ReturnType<typeof generateMintSignature>>
  >,
) {
  return generatedMint({
    contract: options.contract,
    asyncParams: async () => {
      const { payload, signature } = options;
      return {
        to: payload.recipient,
        amount: BigInt(payload.quantity),
        data: encodeBytesBeforeMintERC20Params({
          params: {
            request: payload,
            signature,
          },
        }),
      };
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
 * @extension ERC20
 * @returns A promise that resolves to the payload and signature.
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  const currency = mintRequest.currency || NATIVE_TOKEN_ADDRESS;
  const [pricePerUnit, quantity] = await Promise.all([
    // price per token in wei
    (async () => {
      // if pricePerUnit is provided, use it
      if ("pricePerUnit" in mintRequest && mintRequest.pricePerUnit) {
        return mintRequest.pricePerUnit;
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
  ]);
  const uid = options.mintRequest.uid || randomBytesHex();

  const startTime = mintRequest.validityStartTimestamp || new Date(0);
  const endTime = mintRequest.validityEndTimestamp || tenYearsFromNow();

  const payload: PayloadType = {
    pricePerUnit,
    quantity,
    uid,
    currency,
    recipient: mintRequest.recipient,
    startTimestamp: Number(dateToSeconds(startTime)),
    endTimestamp: Number(dateToSeconds(endTime)),
  };

  const signature = await account.signTypedData({
    domain: {
      name: "MintableERC20",
      version: "1",
      chainId: contract.chain.id,
      verifyingContract: contract.address as Hex,
    },
    types: { MintRequestERC20: MintRequestERC20 },
    primaryType: "MintRequestERC20",
    message: payload,
  });
  return { payload, signature };
}

type PayloadType = AbiParameterToPrimitiveType<{
  type: "tuple";
  name: "payload";
  components: typeof MintRequestERC20;
}>;

type GeneratePayloadInput = {
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  recipient: string;
  currency?: string;
  pricePerUnit?: bigint;
  uid?: Hex;
} & ({ quantity: string } | { quantityWei: bigint });

export const MintRequestERC20 = [
  { name: "startTimestamp", type: "uint48" },
  { name: "endTimestamp", type: "uint48" },
  { name: "recipient", type: "address" },
  { name: "quantity", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "pricePerUnit", type: "uint256" },
  { name: "uid", type: "bytes32" },
] as const;
