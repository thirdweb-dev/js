/**
 * Rounds a number to the first decimal place
 */
export const roundToFirstDecimal = (value: number): string => {
  if (value >= 1) {
    const remainder = value % 1;
    if (remainder === 0) {
      return value.toFixed(0);
    }
    return `${value.toString().split(".")[0]}.${roundToFirstDecimal(remainder).toString().split(".")[1]}`;
  }
  const decimalPlaces = 1 - Math.floor(Math.log10(value));
  return value.toFixed(decimalPlaces);
};
