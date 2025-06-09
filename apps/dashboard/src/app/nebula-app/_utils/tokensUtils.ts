/**
 * Rounds a number to the first decimal place
 */
export const roundToFirstDecimal = (value: number) => {
  if (value >= 1) {
    return value.toFixed(1);
  }
  const decimalPlaces = 1 - Math.floor(Math.log10(value));
  return value.toFixed(decimalPlaces);
};
