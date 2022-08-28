import { IStorage } from "../interfaces/IStorage";
import { UploadResult } from "../interfaces/IStorageUpload";
import { FileOrBuffer, JsonObject } from "../types";
import { UploadProgressEvent } from "../types/events";
import { File } from "@web-std/file";

/**
 * Fetch and upload files to IPFS or any other storage.
 * @public
 */
export class RemoteStorage {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  /**
   * Fetch data from any IPFS hash without worrying about gateways, data types, etc.
   * Simply pass in an IPFS url and we'll handle fetching for you and try every public gateway
   * to get the fastest response.
   *
   * @example
   * ```javascript
   * // Your IPFS hash here
   * const hash = "ipfs://..."
   * const data = await sdk.storage.fetch(hash);
   * ```
   * @param hash - The IPFS hash of the file or data to fetch
   * @returns The data stored at the specified IPFS hash
   */
  public async fetch(hash: string): Promise<Record<string, any>> {
    return this.storage.get(hash);
  }

  /**
   * Upload any data to an IPFS directory. We'll handle all the details for you, including
   * pinning your files and making sure that you get the fastest upload speeds.
   *
   * @example
   * ```javascript
   * // File upload
   * const files = [
   *   fs.readFileSync("file1.png"),
   *   fs.readFileSync("file2.png"),
   * ]
   * const result = await sdk.storage.upload(files);
   * // uri for each uploaded file will look like something like: ipfs://<hash>/0
   *
   * // JSON metadata upload
   * const jsonMetadata = {
   *   name: "Name",
   *   description: "Description",
   * }
   * const result = await sdk.storage.upload(jsonMetadata);
   *
   * // Upload progress (browser only)
   * const result = await sdk.storage.upload(files, {
   *   onProgress: (event: UploadProgressEvent) => {
   *     console.log(`Downloaded ${event.progress} / ${event.total}`);
   *   },
   * });
   * ```
   *
   * @param data - An array of file data or an array of JSON metadata to upload to IPFS
   * @param options - Optional. Upload progress callback.
   * @returns The IPFS hash of the directory that holds all the uploaded data
   */
  public async upload(
    data: FileOrBuffer[] | JsonObject[] | FileOrBuffer | JsonObject,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult> {
    if (!Array.isArray(data)) {
      if (
        data instanceof File ||
        data instanceof Buffer ||
        (data.name && data.data && data.data instanceof Buffer)
      ) {
        return this.uploadBatch([data as FileOrBuffer], options);
      } else {
        return this.uploadMetadataBatch([data as JsonObject], options);
      }
    }

    const allFiles = (data as any[]).filter(
      (item: any) =>
        item instanceof File ||
        item instanceof Buffer ||
        (item.name && item.data && item.data instanceof Buffer)
    );
    const allObjects = (data as any[]).filter(
      (item: any) => !(item instanceof File) && !(item instanceof Buffer)
    );
    if (allFiles.length === data.length) {
      return this.uploadBatch(data as FileOrBuffer[], options);
    } else if (allObjects.length === data.length) {
      return this.uploadMetadataBatch(data as JsonObject[], options);
    } else {
      throw new Error(
        "Data to upload must be either all files or all JSON objects"
      );
    }
  }

  private async uploadBatch(
    files: FileOrBuffer[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult> {
    return await this.storage.uploadBatch(
      files,
      undefined,
      undefined,
      undefined,
      options
    );
  }

  private async uploadMetadataBatch(
    metadatas: JsonObject[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult> {
    return await this.storage.uploadMetadataBatch(
      metadatas,
      undefined,
      undefined,
      undefined,
      options
    );
  }
}
