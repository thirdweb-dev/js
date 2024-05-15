let textDecoder: TextDecoder;

/**
 * Re-using the same textdecoder is faster.
 *
 * @returns
 * @internal
 */
export function cachedTextDecoder(): TextDecoder {
  if (!textDecoder) {
    textDecoder = new TextDecoder();
  }
  return textDecoder;
}
