import type { Hex } from "../utils/encoding/hex.js";

export type Erc6492Signature = {
  address: string;
  data: Hex;
  signature: Hex;
};
