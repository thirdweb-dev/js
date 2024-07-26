import type { Hex } from "../utils/encoding/hex.js";

/**
 * @auth
 */
export type Erc6492Signature = {
  address: string;
  data: Hex;
  signature: Hex;
};
