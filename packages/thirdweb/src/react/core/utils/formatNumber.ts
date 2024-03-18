/**
 * @internal
 */
export function formatNumber(value: number, decimalPlaces: number) {
  return Number(value.toFixed(decimalPlaces));
}
