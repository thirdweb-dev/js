export function utf8ToHex(str: string) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const hexValue = charCode.toString(16);

    // Pad with zeros to ensure two-digit representation
    hex += hexValue.padStart(2, "0");
  }
  return hex;
}

export function hexToUtf8(hex: string) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    const hexValue = hex.substring(i, i + 2);
    const decimalValue = parseInt(hexValue, 16);
    str += String.fromCharCode(decimalValue);
  }
  return str;
}
