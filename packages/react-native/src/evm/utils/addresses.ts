/**
 * Shortens an EVM compatible address to show the first 6 and last 4 characters
 *
 * @param str The address to shorten
 * @param extraShort If true, show the first 4 and last 3 characters
 * @returns The shortened address
 */
export function shortenWalletAddress(str?: string, extraShort?: true) {
  if (!str) {
    return str;
  }

  return `${str.substring(0, extraShort ? 4 : 6)}...${str.substring(
    str.length - (extraShort ? 3 : 4),
  )}`;
}
