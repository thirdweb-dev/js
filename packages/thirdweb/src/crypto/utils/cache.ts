class TextProcessorCache {
  private _encoder: TextEncoder | undefined;
  private _decoder: TextDecoder | undefined;

  get encoder(): TextEncoder {
    if (!this._encoder) {
      this._encoder = new TextEncoder();
    }
    return this._encoder;
  }

  get decoder(): TextDecoder {
    if (!this._decoder) {
      this._decoder = new TextDecoder();
    }
    return this._decoder;
  }
}

// create a singleton instance of the TextProcessorCache
const textProcessorSingleton = new TextProcessorCache();

/**
 * @internal
 */
export function getCachedTextEncoder(): TextEncoder {
  return textProcessorSingleton.encoder;
}

/**
 * @internal
 */
export function getCachedTextDecoder(): TextDecoder {
  return textProcessorSingleton.decoder;
}
