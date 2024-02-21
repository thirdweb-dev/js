let textEncoder: TextEncoder;

/**
 * Re-using the same textencoder is faster.
 *
 * @returns
 * @internal
 */
export function cachedTextEncoder(): TextEncoder {
  return textEncoder || (textEncoder = new TextEncoder());
}
