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

export function signMessage({ message, privateKey }: SignMessageOptions): Hex {
  const signature = sign({ hash: hashMessage(message), privateKey });
  return signatureToHex(signature);
}
