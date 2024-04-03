/**
 * @internal
 * @param hex - The hex string to convert to bytes
 */
export function hexToBytes(hex: string | number) {
  hex = hex.toString(16);
  if (!hex.startsWith("0x")) {
    hex = `0x${hex}`;
  }
  if (!isHexStrict(hex)) {
    throw new Error(`Given value "${hex}" is not a valid hex string.`);
  }
  hex = hex.replace(/^0x/i, "");
  const bytes: number[] = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  }
  return bytes;
}

/**
 * @internal
 * @param hex - The hex string to check
 */
function isHexStrict(hex: string | number) {
  return (
    (typeof hex === "string" || typeof hex === "number") &&
    /^(-)?0x[0-9a-f]*$/i.test(hex.toString())
  );
}
