import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses.js";
import type { ThirdwebContract } from "../../../contract/contract.js";
import type { BaseTransactionOptions } from "../../../transaction/types.js";
import { getAddress } from "../../../utils/address.js";
import { dateToSeconds, tenYearsFromNow } from "../../../utils/date.js";
import type { Hex } from "../../../utils/encoding/hex.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import { mintWithSignature as generatedMint } from "../__generated__/ERC20Core/write/mintWithSignature.js";
import {
  type EncodeBytesBeforeMintWithSignatureERC20Params,
  encodeBytesBeforeMintWithSignatureERC20Params,
} from "../__generated__/MintableERC20/encode/encodeBytesBeforeMintWithSignatureERC20.js";

/**
 * Mints ERC20 tokens to a specified address with a signature via a MintableERC20 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC20 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC20.generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     recipient: "0x...",
 *     quantity: "10",
 *   },
 * });
 *
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC20.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC20
 */
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
        to: payload.to,
        amount: payload.amount,
        data: payload.data,
        signature,
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
 * Generates a mint signature for a given mint request to be used with a MintableERC20 module.
 * @param options The options for minting tokens.
 * @returns A transaction to mint tokens.
 * @example
 * ```typescript
 * import { MintableERC20 } from "thirdweb/modules";
 *
 * // generate the payload and signature, this is typically done on the server
 * // requires to be generated with a wallet that has the MINTER_ROLE
 * const { payload, signature } = await MintableERC20.generateMintSignature({
 *   account,
 *   contract,
 *   mintRequest: {
 *     recipient: "0x...",
 *     quantity: "10",
 *   },
 * });
 *
 * // prepare the transaction, this is typically done on the client
 * // can be executed by any wallet
 * const transaction = MintableERC20.mintWithSignature({
 *   contract,
 *   payload,
 *   signature,
 * });
 *
 * // Send the transaction
 * await sendTransaction({ transaction, account });
 * ```
 * @modules MintableERC20
 */
export async function generateMintSignature(
  options: GenerateMintSignatureOptions,
) {
  const { mintRequest, account, contract } = options;
  const currency = getAddress(mintRequest.currency || NATIVE_TOKEN_ADDRESS);
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

  const mintParams: EncodeBytesBeforeMintWithSignatureERC20Params["params"] = {
    pricePerUnit,
    uid,
    currency,
    startTimestamp: Number(dateToSeconds(startTime)),
    endTimestamp: Number(dateToSeconds(endTime)),
  };

  const payload = {
    to: getAddress(mintRequest.recipient),
    amount: quantity,
    data: encodeBytesBeforeMintWithSignatureERC20Params({
      params: mintParams,
    }),
  };

  const signature = await account.signTypedData({
    domain: {
      name: "ERC20Core",
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

type GeneratePayloadInput = {
  validityStartTimestamp?: Date;
  validityEndTimestamp?: Date;
  recipient: string;
  currency?: string;
  pricePerUnit?: bigint;
  uid?: Hex;
} & ({ quantity: string } | { quantityWei: bigint });

const MintRequestERC20 = [
  { type: "address", name: "to" },
  { type: "uint256", name: "amount" },
  { type: "bytes", name: "data" },
] as const;
