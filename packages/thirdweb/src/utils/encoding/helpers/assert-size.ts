import { byteSize } from "./byte-size.js";
import type { Hex } from "./is-hex.js";

/**
 * Asserts that the size of the given hex or bytes is not greater than the specified size.
 * @param hexOrBytes - The hex or bytes to check the size of.
 * @param size - The maximum allowed size.
 * @throws Error if the size of the hex or bytes is greater than the specified size.
 * @example
 * ```ts
 * import { assertSize } from "thirdweb/utils";
 * assertSize("0x1a4", { size: 2 });
 * ```
 * @internal
 */
export function assertSize(
  hexOrBytes: Hex | Uint8Array,
  { size }: { size: number },
): void {
  const givenSize = byteSize(hexOrBytes);
  if (givenSize > size) {
    throw new Error(`Size overflow: ${givenSize} > ${size}`);
  }
}
