import * as ox__Hex from "ox/Hex";
import * as ox__PersonalMessage from "ox/PersonalMessage";
import * as ox__Secp256k1 from "ox/Secp256k1";
import * as ox__Signature from "ox/Signature";
import type { Account } from "../../wallets/interfaces/wallet.js";
import type { Hex } from "../encoding/hex.js";
import type { Prettify } from "../type-utils.js";

type Message = Prettify<
  | string
  | {
      raw: Hex | Uint8Array;
    }
>;
export type SignMessageOptions = {
  message: Message;
  privateKey: Hex;
};

/**
 * Signs a string message with a given private key.
 * @param options The options for signing.
 * @param options.message The message to be signed as a string or object containing raw hex or bytes
 * @param options.privateKey The private key to be used
 * @returns The signature as a hex string
 * @example
 * ```ts
 * import { signMessage } from "thirdweb/utils";
 * signMessage({
 *   message: "Hello, world!",
 *   privateKey: "0x...",
 * });
 * ```
 * @utils
 */
export function signMessage({ message, privateKey }: SignMessageOptions): Hex;

/**
 * Signs a string message with a given account.
 * @param options The options for signing.
 * @param options.message The message to be signed as a string or object containing raw hex or bytes
 * @param options.account The account to be used
 * @returns The signature as a hex string
 * @example
 * ```ts
 * import { signMessage } from "thirdweb/utils";
 * await signMessage({
 *   message: "Hello, world!",
 *   account
 * });
 * ```
 * @walletUtils
 */
export function signMessage({
  message,
  account,
}: {
  message: Message;
  account: Account;
}): Promise<Hex>;

export function signMessage(
  options: SignMessageOptions | { message: Message; account: Account },
): Hex | Promise<Hex> {
  if ("privateKey" in options) {
    const payload = ox__PersonalMessage.getSignPayload(
      typeof options.message === "object"
        ? options.message.raw
        : ox__Hex.fromString(options.message),
    );

    const signature = ox__Secp256k1.sign({
      payload,
      privateKey: options.privateKey,
    });
    return ox__Signature.toHex(signature);
  }
  if ("account" in options) {
    const { message, account } = options;
    return account.signMessage({ message });
  }
  throw new Error("Either privateKey or account is required");
}
