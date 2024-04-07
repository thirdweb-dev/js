/**
 * @internal
 */
export function shortenString(str: string, extraShort = true) {
  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}
