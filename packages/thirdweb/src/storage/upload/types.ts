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

export type UploadableFile = FileOrBufferOrString | Record<string, unknown>;

export type UploadOptions<TFiles extends UploadableFile[]> = {
  files: TFiles;
} & BuildFormDataOptions;

export type UploadFile =
  | { name?: string; type?: string; uri: string }
  | Record<string, unknown>;

export type InternalUploadMobileOptions = {
  files: UploadFile[];
} & BuildFormDataOptions;
