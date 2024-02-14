import { concat, toHex } from "viem";
import type { UserOperationStruct } from "../types.js";

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
  return BigInt(concat([toHex(generateRandomUint192()), "0x0000000000000000"]));
};

/**
 * @internal
 */
export async function hexlifyUserOp(userOp: UserOperationStruct): Promise<any> {
  return Object.keys(userOp)
    .map((key) => {
      let val = (userOp as any)[key];
      if (typeof val !== "string" || !val.startsWith("0x")) {
        val = toHex(val);
      }
      return [key, val];
    })
    .reduce(
      (set, [k, v]) => ({
        ...set,
        [k]: v,
      }),
      {},
    );
}
