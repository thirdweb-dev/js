import type { Hex } from "../encoding/hex.js";
import { hashMessage } from "../hashing/hashMessage.js";
import type { Prettify } from "../type-utils.js";
import { sign } from "./sign.js";
import { signatureToHex } from "./signature-to-hex.js";

export type SignMessageOptions = {
  message: Prettify<
    | string
    | {
        raw: Hex | Uint8Array;
      }
  >;
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
export function signMessage({ message, privateKey }: SignMessageOptions): Hex {
  const signature = sign({ hash: hashMessage(message), privateKey });
  return signatureToHex(signature);
}
