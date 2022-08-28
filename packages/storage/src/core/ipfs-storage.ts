import {
  DEFAULT_IPFS_GATEWAY,
  PINATA_IPFS_URL,
  PUBLIC_GATEWAYS,
} from "../constants/urls";
import {
  replaceFilePropertiesWithHashes,
  replaceGatewayUrlWithHash,
  replaceHashWithGatewayUrl,
  resolveGatewayUrl,
} from "../helpers/storage";
import { IStorage } from "../interfaces/IStorage";
import { IStorageUpload, UploadResult } from "../interfaces/IStorageUpload";
import { FileOrBuffer, JsonObject } from "../types";
import { UploadProgressEvent } from "../types/events";
import { PinataUploader } from "../uploaders/pinata-uploader";
import { File } from "@web-std/file";
import fetch from "cross-fetch";
import FormData from "form-data";

/**
 * IPFS Storage implementation, accepts custom IPFS gateways
 * @remarks By default, thirdweb automatically uploads files to IPFS when you perform operations such as minting, this class allows you to do it manually.
 * @public
 */
export class IpfsStorage implements IStorage {
  /**
   * {@inheritdoc IStorage.gatewayUrl}
   * @internal
   */
  public gatewayUrl: string;
  private failedUrls: string[] = [];
  private uploader: IStorageUpload;

  constructor(
    gatewayUrl: string = DEFAULT_IPFS_GATEWAY,
    uploader: IStorageUpload = new PinataUploader()
  ) {
    this.gatewayUrl = `${gatewayUrl.replace(/\/$/, "")}/`;
    this.uploader = uploader;
  }

  private getNextPublicGateway() {
    const urlsToTry = PUBLIC_GATEWAYS.filter(
      (url) => !this.failedUrls.includes(url)
    ).filter((url) => url !== this.gatewayUrl);
    if (urlsToTry.length > 0) {
      return urlsToTry[0];
    } else {
      this.failedUrls = [];
      return undefined;
    }
  }

  /**
   * Upload a file to IPFS and return the hash
   * @remarks This method is a wrapper around {@link IStorage.upload}
   * @example
   * ```javascript
   * const file = './path/to/file.png'; // Can be a path or a File object such as a file from an input element.
   * const hash = await sdk.storage.upload(file);
   * ```
   *
   *
   */
  public async upload(
    data: string | FileOrBuffer,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<string> {
    const { cid, fileNames } = await this.uploader.uploadBatchWithCid(
      [data],
      0,
      contractAddress,
      signerAddress,
      options
    );

    const baseUri = `ipfs://${cid}/`;
    return `${baseUri}${fileNames[0]}`;
  }

  /**
   * {@inheritDoc IStorage.uploadBatch}
   */
  public async uploadBatch(
    files: (string | FileOrBuffer)[],
    fileStartNumber = 0,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ) {
    const { cid, fileNames } = await this.uploader.uploadBatchWithCid(
      files,
      fileStartNumber,
      contractAddress,
      signerAddress,
      options
    );

    const baseUri = `ipfs://${cid}/`;
    const uris = fileNames.map((filename) => `${baseUri}${filename}`);
    return {
      baseUri,
      uris,
    };
  }

  /**
   * {@inheritDoc IStorage.get}
   */
  public async get(hash: string): Promise<Record<string, any>> {
    const res = await this._get(hash);
    const json = await res.json();
    return replaceHashWithGatewayUrl(json, "ipfs://", this.gatewayUrl);
  }

  /**
   * {@inheritDoc IStorage.getRaw}
   */
  public async getRaw(hash: string): Promise<string> {
    const res = await this._get(hash);
    return await res.text();
  }

  /**
   * {@inheritDoc IStorage.uploadMetadata}
   */
  public async uploadMetadata(
    metadata: JsonObject,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<string> {
    // since there's only single object, always use the first index
    const { uris } = await this.uploadMetadataBatch(
      [metadata],
      0,
      contractAddress,
      signerAddress,
      options
    );
    return uris[0];
  }

  /**
   * {@inheritDoc IStorage.uploadMetadataBatch}
   */
  public async uploadMetadataBatch(
    metadatas: JsonObject[],
    fileStartNumber?: number,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<UploadResult> {
    const metadataToUpload = (
      await this.batchUploadProperties(metadatas, options)
    ).map((m: any) => JSON.stringify(m));

    const { cid, fileNames } = await this.uploader.uploadBatchWithCid(
      metadataToUpload,
      fileStartNumber,
      contractAddress,
      signerAddress
    );

    const baseUri = `ipfs://${cid}/`;
    const uris = fileNames.map((filename) => `${baseUri}${filename}`);

    return {
      baseUri,
      uris,
    };
  }

  /** *************************
   * PRIVATE FUNCTIONS
   *************************/

  private async _get(hash: string): Promise<Response> {
    let uri = hash;
    if (hash) {
      uri = resolveGatewayUrl(hash, "ipfs://", this.gatewayUrl);
    }
    const result = await fetch(uri);
    if (!result.ok && result.status === 500) {
      throw new Error(`Error fetching ${uri} - Status code ${result.status}`);
    }
    if (!result.ok && result.status !== 404) {
      const nextUrl = this.getNextPublicGateway();
      if (nextUrl) {
        this.failedUrls.push(this.gatewayUrl);
        this.gatewayUrl = nextUrl;
        return this._get(hash);
      } else {
        throw new Error(`Error fetching ${uri} - Status code ${result.status}`);
      }
    }
    return result;
  }

  /**
   * Pre-processes metadata and uploads all file properties
   * to storage in *bulk*, then performs a string replacement of
   * all file properties -\> the resulting ipfs uri. This is
   * called internally by `uploadMetadataBatch`.
   *
   * @internal
   *
   * @returns - The processed metadata with properties pointing at ipfs in place of `File | Buffer`
   * @param metadatas
   * @param options
   */
  private async batchUploadProperties(
    metadatas: JsonObject[],
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ) {
    // replace all active gateway url links with their raw ipfs hash
    const sanitizedMetadatas = replaceGatewayUrlWithHash(
      metadatas,
      "ipfs://",
      this.gatewayUrl
    );
    // extract any binary file to upload
    const filesToUpload = sanitizedMetadatas.flatMap((m: JsonObject) =>
      this.buildFilePropertiesMap(m, [])
    );
    // if no binary files to upload, return the metadata
    if (filesToUpload.length === 0) {
      return sanitizedMetadatas;
    }
    // otherwise upload those files
    const { cid, fileNames } = await this.uploader.uploadBatchWithCid(
      filesToUpload,
      undefined,
      undefined,
      undefined,
      options
    );

    const cids = [];
    // recurse ordered array
    for (const filename of fileNames) {
      cids.push(`${cid}/${filename}`);
    }

    // replace all files with their ipfs hash
    return replaceFilePropertiesWithHashes(sanitizedMetadatas, cids);
  }

  /**
   * This function recurisely traverses an object and hashes any
   * `Buffer` or `File` objects into the returned map.
   *
   * @param object - the Json Object
   * @param files - The running array of files or buffer to upload
   * @returns - The final map of all hashes to files
   */
  private buildFilePropertiesMap(
    object: JsonObject,
    files: (File | Buffer)[] = []
  ): (File | Buffer)[] {
    if (Array.isArray(object)) {
      object.forEach((element) => {
        this.buildFilePropertiesMap(element, files);
      });
    } else if (object) {
      const values = Object.values(object);
      for (const val of values) {
        if (val instanceof File || val instanceof Buffer) {
          files.push(val);
        } else if (typeof val === "object") {
          this.buildFilePropertiesMap(val as JsonObject, files);
        }
      }
    }
    return files;
  }

  /**
   * FOR TESTING ONLY
   * @internal
   * @param data -
   * @param contractAddress -
   * @param signerAddress -
   */
  public async uploadSingle(
    data: string | Record<string, any>,
    contractAddress?: string,
    signerAddress?: string
  ): Promise<string> {
    // TODO move down to IStorageUpload
    const token = await (this.uploader as PinataUploader).getUploadToken(
      contractAddress || ""
    );
    const metadata = {
      name: `CONSOLE-TS-SDK-${contractAddress}`,
      keyvalues: {
        sdk: "typescript",
        contractAddress,
        signerAddress,
      },
    };
    const formData = new FormData();
    const filepath = `files`; // Root directory
    formData.append("file", data as any, filepath as any);
    formData.append("pinataMetadata", JSON.stringify(metadata));
    formData.append(
      "pinataOptions",
      JSON.stringify({
        wrapWithDirectory: false,
      })
    );
    const res = await fetch(PINATA_IPFS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData.getBuffer(),
    });
    if (!res.ok) {
      throw new Error(`Failed to upload to IPFS [status code = ${res.status}]`);
    }

    const body = await res.json();
    return body.IpfsHash;
  }
}
