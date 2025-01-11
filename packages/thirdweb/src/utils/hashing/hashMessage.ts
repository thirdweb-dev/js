import * as ox__Bytes from "ox/Bytes";
import type { Hex } from "../encoding/hex.js";
import { stringToBytes, toBytes } from "../encoding/to-bytes.js";
import type { SignableMessage } from "../types.js";
import { keccak256 } from "./keccak256.js";

const presignMessagePrefix = "\x19Ethereum Signed Message:\n";
type To = "hex" | "bytes";

type HashMessage<TTo extends To> =
  | (TTo extends "bytes" ? ox__Bytes.Bytes : never)
  | (TTo extends "hex" ? Hex : never);

/**
 * Ethereum Signed Message hashing
 * @param message - The message to hash, either as a string, a Uint8Array, or an object with a `raw` property containing a Uint8Array.
 * @param to_ - The desired output format of the hash (optional). Defaults to 'hex'.
 * @example
 * ```ts
 * import { hashMessage } from "thirdweb/utils";
 * const hash = hashMessage("hello world");
 * ```
 * @returns The Ethereum Signed Message hash of the message in the specified format.
 * @utils
 */
export function hashMessage<TTo extends To = "hex">(
  message: SignableMessage,
  to_?: TTo,
): HashMessage<TTo> {
  const messageBytes = (() => {
    if (typeof message === "string") {
      return stringToBytes(message);
    }
    if (message.raw instanceof Uint8Array) {
      return message.raw;
    }
    return toBytes(message.raw);
  })();
  const prefixBytes = stringToBytes(
    `${presignMessagePrefix}${messageBytes.length}`,
  );
  return keccak256(ox__Bytes.concat(prefixBytes, messageBytes), to_);
}
