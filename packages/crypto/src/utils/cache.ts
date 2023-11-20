class TextProcessorCache {
  #encoder: TextEncoder | undefined;
  #decoder: TextDecoder | undefined;

  get encoder(): TextEncoder {
    if (!this.#encoder) {
      this.#encoder = new TextEncoder();
    }
    return this.#encoder;
  }

  get decoder(): TextDecoder {
    if (!this.#decoder) {
      this.#decoder = new TextDecoder();
    }
    return this.#decoder;
  }
}

// create a singleton instance of the TextProcessorCache
const textProcessorSingleton = new TextProcessorCache();

export function getCachedTextEncoder(): TextEncoder {
  return textProcessorSingleton.encoder;
}

export function getCachedTextDecoder(): TextDecoder {
  return textProcessorSingleton.decoder;
}
