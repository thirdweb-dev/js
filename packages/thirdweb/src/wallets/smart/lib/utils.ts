import { concat } from "viem";
import type { UserOperation, UserOperationHexed } from "../types.js";
import { isHex, numberToHex, toHex } from "../../../utils/hex.js";

const generateRandomUint192 = (): bigint => {
  const rand1 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand2 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand3 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand4 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand5 = BigInt(Math.floor(Math.random() * 0x100000000));
  const rand6 = BigInt(Math.floor(Math.random() * 0x100000000));
  return (
    (rand1 << BigInt(160)) |
    (rand2 << BigInt(128)) |
    (rand3 << BigInt(96)) |
    (rand4 << BigInt(64)) |
    (rand5 << BigInt(32)) |
    rand6
  );
};

/**
 * @internal
 */
export const randomNonce = () => {
  return BigInt(
    concat([numberToHex(generateRandomUint192()), "0x0000000000000000"]),
  );
};

/**
 * @internal
 */
export function hexlifyUserOp(userOp: UserOperation): UserOperationHexed {
  return Object.fromEntries(
    Object.entries(userOp).map(([key, val]) => [
      key,
      // turn any value that's not hex into hex
      isHex(val) ? val : toHex(val),
    ]),
  ) as UserOperationHexed;
}
