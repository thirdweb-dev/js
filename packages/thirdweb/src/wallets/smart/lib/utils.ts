import { isHex, toHex } from "../../../utils/encoding/hex.js";
import type {
  UserOperationV06,
  UserOperationV06Hexed,
  UserOperationV07,
  UserOperationV07Hexed,
} from "../types.js";

export const generateRandomUint192 = (): bigint => {
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
export function hexlifyUserOp(
  userOp: UserOperationV06 | UserOperationV07,
): UserOperationV06Hexed | UserOperationV07Hexed {
  return Object.fromEntries(
    Object.entries(userOp).map(([key, val]) => [
      key,
      // turn any value that's not hex into hex
      val === undefined || val === null || isHex(val) ? val : toHex(val),
    ]),
  ) as UserOperationV06Hexed | UserOperationV07Hexed;
}
