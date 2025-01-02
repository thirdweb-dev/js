export function getBuyTokenAmountFontSize(value: string) {
  return value.length > 10 ? "26px" : value.length > 6 ? "34px" : "50px";
}
