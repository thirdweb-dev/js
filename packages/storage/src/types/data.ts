/**
 * @internal
 */
export type FileOrBuffer = File | Uint8Array | BufferOrStringWithName;

/**
 * @internal
 */
export type BufferOrStringWithName = {
  data: Uint8Array | string;
  name: string;
};

/**
 * @internal
 */
export type FileOrBufferOrString = FileOrBuffer | string;
