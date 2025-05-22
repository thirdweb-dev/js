export function getBuyTokenAmountFontSize(value: string) {
  return value.length > 10 ? "26px" : value.length > 6 ? "34px" : "50px";
}

/**
 *
 * @param str accepts any string but expects a fully upppercased string / type FiatProvider
 * @returns Fiat provider label to be rendered used within presentation logic
 */
export function getProviderLabel(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
