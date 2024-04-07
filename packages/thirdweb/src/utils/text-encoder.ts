let textEncoder: TextEncoder;

/**
 * Re-using the same textencoder is faster.
 *
 * @returns
 * @internal
 */
export function cachedTextEncoder(): TextEncoder {
  if (!textEncoder) {
    textEncoder = new TextEncoder();
  }
  return textEncoder;
}
