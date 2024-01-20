let textDecoder: TextDecoder;

/**
 * Re-using the same textdecoder is faster.
 *
 * @returns
 * @internal
 */
export function cachedTextDecoder(): TextDecoder {
  return textDecoder || (textDecoder = new TextDecoder());
}
