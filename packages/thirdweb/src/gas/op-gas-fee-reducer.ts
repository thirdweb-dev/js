/**
 * Via: https://twitter.com/0xjustadev/status/1758973668011434062
 *
 * Increases the gas fee value to the nearest power of 2.
 * If the value is already a power of 2 or 0, it returns the value as is.
 * Otherwise, it finds the highest power of 2 that is bigger than the given value.
 * @param value - The gas fee value to be "rounded up".
 * @returns The *increased* gas value which will result in a lower L1 gas fee, overall reducing the gas fee.
 * @internal
 */
export function roundUpGas(value: bigint): bigint {
  if (value === 0n || (value & (value - 1n)) === 0n) {
    return value;
  }

  // Find the highest set bit by shifting until the value is 0.
  let highestBit = 1n;
  while (value > 0n) {
    value >>= 1n;
    highestBit <<= 1n;
  }

  return highestBit;
}
