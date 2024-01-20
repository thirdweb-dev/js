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

export type BuildFormDataOptions = {
  rewriteFileNames?: {
    fileStartNumber: number;
  };
  uploadWithoutDirectory?: boolean;
  metadata?: Record<string, string>;
};

export type UploadOptions = {
  files: (FileOrBufferOrString | Record<string, unknown>)[];
} & BuildFormDataOptions;
