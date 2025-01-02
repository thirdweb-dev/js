import { concat, padHex } from "viem";
import { type Address, getAddress } from "../../address.js";
import type { Hex } from "../../encoding/hex.js";
import { stringToBytes } from "../../encoding/to-bytes.js";
import { keccak256 } from "../../hashing/keccak256.js";

export function create2Address(options: {
  sender: Address;
  bytecodeHash: Hex;
  salt: Hex;
  input?: Hex;
}): string {
  const { sender, bytecodeHash, salt, input } = options;
  const prefix = keccak256(stringToBytes("zksyncCreate2"));
  const inputHash = input ? keccak256(input) : "0x";
  const addressBytes = keccak256(
    concat([
      prefix,
      padHex(sender, { size: 32 }),
      salt,
      bytecodeHash,
      inputHash,
    ]),
  ).slice(26);
  return getAddress(`0x${addressBytes}`);
}
