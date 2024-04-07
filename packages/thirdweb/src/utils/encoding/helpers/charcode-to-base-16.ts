const charCodeMap = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102,
} as const;

/**
 * @internal
 */
export function charCodeToBase16(char: number) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine) {
    return char - charCodeMap.zero;
  }
  if (char >= charCodeMap.A && char <= charCodeMap.F) {
    return char - (charCodeMap.A - 10);
  }
  if (char >= charCodeMap.a && char <= charCodeMap.f) {
    return char - (charCodeMap.a - 10);
  }
  return undefined;
}
