import {
  GatewayUrls,
  IStorageDownloader,
  IStorageUploader,
  IpfsUploadBatchOptions,
  IpfsUploaderOptions,
  StorageDownloader,
  ThirdwebStorageOptions,
  UploadOptions,
  isFileBufferOrStringEqual,
  parseGatewayUrls,
  replaceObjectSchemesWithGatewayUrls,
  replaceSchemeWithGatewayUrl,
  IThirdwebStorage,
  TW_UPLOAD_SERVER_URL,
} from "@thirdweb-dev/storage";

import DeviceInfo from "react-native-device-info";
import { PINATA_IPFS_FILE_URL, PINATA_IPFS_JSON_URL } from "./constants";
import { prepareGatewayUrls } from "./utils";

const APP_NAME = DeviceInfo.getBundleId();

export class IpfsUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  public uploadWithGatewayUrl?: boolean | undefined;
  private clientId?: string;

  constructor(options?: IpfsUploaderOptions) {
    this.uploadWithGatewayUrl = options?.uploadWithGatewayUrl || false;
    this.clientId = options?.clientId;
  }

  async uploadBatch(
    data: FormDataValue[],
    options?: IpfsUploadBatchOptions | undefined,
  ): Promise<string[]> {
    if (data.length === 0) {
      throw new Error("[UPLOAD_BATCH_ERROR] No files or objects to upload.");
    }

    if (
      options?.uploadWithoutDirectory &&
      data.length > 1 &&
      typeof data[0] !== "string"
    ) {
      throw new Error(
        "[UPLOAD_WITHOUT_DIRECTORY_ERROR] Cannot upload more than one file without directory!",
      );
    }

    const metadata = {
      name: APP_NAME,
      keyvalues: { ...options?.metadata },
    };

    if (typeof data[0] === "string") {
      // assume an array of strings
      return new Promise(async (resolve, reject) => {
        const fetchBody = JSON.stringify({
          pinataMetadata: metadata,
          pinataContent: {
            data: data,
          },
        });

        const token = await this.getUploadToken();

        try {
          const res = await fetch(PINATA_IPFS_JSON_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: fetchBody,
          });
          if (res.ok) {
            const ipfs = await res.json();
            const cid = ipfs.IpfsHash;

            return resolve([`ipfs://${cid}`]);
          }
        } catch (error) {
          reject(error);
        }
      });
    } else {
      // assume an array of files
      return new Promise(async (resolve, reject) => {
        const token = await this.getUploadToken();

        // asume file
        const formData = new FormData();

        const { form, fileNames } = this.buildFormData(
          formData,
          data as { name?: string; type?: string; uri: string }[],
          options,
        );

        const xhr = new XMLHttpRequest();

        let timer = setTimeout(() => {
          xhr.abort();
          reject(
            new Error(
              "Request to upload timed out! No upload progress received in 30s",
            ),
          );
        }, 30000);

        xhr.upload.addEventListener("loadstart", () => {
          console.log(`[${Date.now()}] [IPFS] Started`);
        });

        xhr.upload.addEventListener("progress", (event) => {
          console.log(`[IPFS] Progress Event ${event.loaded}/${event.total}`);

          clearTimeout(timer);

          if (event.loaded < event.total) {
            timer = setTimeout(() => {
              xhr.abort();
              reject(
                new Error(
                  "Request to upload timed out! No upload progress received in 30s",
                ),
              );
            }, 30000);
          } else {
            console.log(
              `[${Date.now()}] [IPFS] Uploaded files. Waiting for response.`,
            );
          }
        });

        xhr.addEventListener("load", () => {
          console.log(`[${Date.now()}] [IPFS] Load`);
          clearTimeout(timer);

          if (xhr.status >= 200 && xhr.status < 300) {
            let body;
            try {
              body = JSON.parse(xhr.responseText);
            } catch (err) {
              return reject(
                new Error("Failed to parse JSON from upload response"),
              );
            }

            const cid = body.IpfsHash;
            if (!cid) {
              throw new Error("Failed to get IPFS hash from upload response");
            }

            return resolve(fileNames.map((name) => `ipfs://${cid}/${name}`));
          }

          return reject(
            new Error(
              `Upload failed with status ${xhr.status} - ${xhr.responseText}`,
            ),
          );
        });

        xhr.addEventListener("error", () => {
          console.log("[IPFS] Load");
          clearTimeout(timer);

          if (
            (xhr.readyState !== 0 && xhr.readyState !== 4) ||
            xhr.status === 0
          ) {
            return reject(
              new Error(
                `This looks like a network error, the endpoint might be blocked by an internet provider or a firewall. ${xhr.responseText}`,
              ),
            );
          }

          return reject(new Error("Unknown upload error occured"));
        });

        xhr.open("POST", PINATA_IPFS_FILE_URL);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);

        xhr.send(form);
      });
    }
  }

  private buildFormData(
    form: FormData,
    files: { name?: string; type?: string; uri: string }[],
    options?: IpfsUploadBatchOptions,
  ) {
    const fileNameToFileMap = new Map<
      string,
      { name?: string; type?: string; uri: string }
    >();
    const fileNames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = "";

      if (options?.rewriteFileNames) {
        let extensions = "";
        if (file.name) {
          const extensionStartIndex = file.name.lastIndexOf(".");
          if (extensionStartIndex > -1) {
            extensions = file.name.substring(extensionStartIndex);
          }
        }
        fileName = `${
          i + options.rewriteFileNames.fileStartNumber
        }${extensions}`;
      } else {
        fileName = `${file.name}`;
      }

      // TODO: If we don't want to wrap with directory, adjust the filepath
      // const filepath = options?.uploadWithoutDirectory
      //   ? 'files'
      //   : `files/${fileName}`;

      if (fileNameToFileMap.has(fileName)) {
        // if the file in the map is the same as the file we are already looking at then just skip and continue
        if (isFileBufferOrStringEqual(fileNameToFileMap.get(fileName), file)) {
          // we add it to the filenames array so that we can return the correct number of urls,
          fileNames.push(fileName);
          // but then we skip because we don't need to upload it multiple times
          continue;
        }
        // otherwise if file names are the same but they are not the same file then we should throw an error (trying to upload to differnt files but with the same names)
        throw new Error(
          `[DUPLICATE_FILE_NAME_ERROR] File name ${fileName} was passed for more than one different file.`,
        );
      }

      // add it to the map so that we can check for duplicates
      fileNameToFileMap.set(fileName, file);
      // add it to the filenames array so that we can return the correct number of urls
      fileNames.push(fileName);

      form.append("file", file);
    }

    const metadata = {
      name: APP_NAME,
      keyvalues: { ...options?.metadata },
    };
    form.append("pinataMetadata", JSON.stringify(metadata));

    if (options?.uploadWithoutDirectory) {
      form.append(
        "pinataOptions",
        JSON.stringify({
          wrapWithDirectory: false,
        }),
      );
    }

    return {
      form,
      // encode the file names on the way out (which is what the upload backend expects)
      fileNames: fileNames.map((fName) => encodeURIComponent(fName)),
    };
  }

  private async getUploadToken(): Promise<string> {
    // TODO this should use the new upload flow
    const res = await fetch(`${TW_UPLOAD_SERVER_URL}/grant`, {
      method: "GET",
      headers: {
        "X-APP-NAME": APP_NAME,
      },
      ...(this.clientId ? { "x-client-id": this.clientId } : {}),
    });

    if (!res.ok) {
      const response = await res.json();
      // throw new Error(`Failed to get upload token`);
      const error = response.error || response.statusText;
      const code = response.code || "UNKNOWN";

      throw new Error(
        `IpfsUploader error: ${error} Status: ${response.status} Code: ${code}`,
      );
    }
    const body = await res.text();
    return body;
  }
}

export class ThirdwebStorage<T extends UploadOptions = IpfsUploadBatchOptions>
  implements IThirdwebStorage
{
  private uploader: IStorageUploader<T>;
  private downloader: IStorageDownloader;
  private gatewayUrls: GatewayUrls;

  constructor(options?: ThirdwebStorageOptions<T>) {
    this.uploader =
      options?.uploader ||
      new IpfsUploader({
        clientId: options?.clientId,
      });
    this.downloader =
      options?.downloader ||
      new StorageDownloader({ clientId: options?.clientId });
    this.gatewayUrls = prepareGatewayUrls(
      parseGatewayUrls(options?.gatewayUrls),
      options?.clientId,
    );
  }

  /**
   * Resolve any scheme on a URL to get a retrievable URL for the data
   *
   * @param url - The URL to resolve the scheme of
   * @returns The URL with its scheme resolved
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const url = storage.resolveScheme(uri);
   * console.log(url);
   * ```
   */
  resolveScheme(url: string): string {
    return replaceSchemeWithGatewayUrl(url, this.gatewayUrls) as string;
  }

  /**
   * Downloads arbitrary data from any URL scheme.
   *
   * @param url - The URL of the data to download
   * @returns The response object fetched from the resolved URL
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const data = await storage.download(uri);
   * ```
   */
  async download(url: string): Promise<Response> {
    return this.downloader.download(url, this.gatewayUrls);
  }

  /**
   * Downloads JSON data from any URL scheme.
   * Resolves any URLs with schemes to retrievable gateway URLs.
   *
   * @param url - The URL of the JSON data to download
   * @returns The JSON data fetched from the resolved URL
   *
   * @example
   * ```jsx
   * const uri = "ipfs://example";
   * const json = await storage.downloadJSON(uri);
   * ```
   */
  async downloadJSON<TJSON = any>(url: string): Promise<TJSON> {
    const res = await this.download(url);

    // If we get a JSON object, recursively replace any schemes with gatewayUrls
    const json = await res.json();
    return replaceObjectSchemesWithGatewayUrls(json, this.gatewayUrls) as TJSON;
  }

  /**
   * Upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns - The URI of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload file data
   * const file = readFileSync("../file.jpg");
   * const fileUri = await storage.upload(file);
   *
   * // Or upload a JSON object
   * const json = { name: "JSON", image: file };
   * const jsonUri = await storage.upload(json);
   * ```
   */
  async upload(data: FormDataValue, options?: T): Promise<string> {
    const [uri] = await this.uploadBatch([data], options);
    return uri;
  }

  /**
   * Batch upload arbitrary file or JSON data using the configured decentralized storage system.
   * Automatically uploads any file data within JSON objects and replaces them with hashes.
   *
   * @param data - Array of arbitrary file or JSON data to upload
   * @param options - Options to pass through to the storage uploader class
   * @returns - The URIs of the uploaded data
   *
   * @example
   * ```jsx
   * // Upload an array of file data
   * const files = [
   *  readFileSync("../file1.jpg"),
   *  readFileSync("../file2.jpg"),
   * ];
   * const fileUris = await storage.uploadBatch(files);
   *
   * // Upload an array of JSON objects
   * const objects = [
   *  { name: "JSON 1", image: files[0] },
   *  { name: "JSON 2", image: files[1] },
   * ];
   * const jsonUris = await storage.uploadBatch(objects);
   * ```
   */
  async uploadBatch(data: FormDataValue[], options?: T): Promise<string[]> {
    data = data.filter((item) => item !== undefined);

    if (!data.length) {
      return [];
    }

    const uris: string[] = await this.uploader.uploadBatch(
      data as FormDataValue[],
      options,
    );

    if (options?.uploadWithGatewayUrl || this.uploader.uploadWithGatewayUrl) {
      return uris.map((uri) => this.resolveScheme(uri));
    } else {
      return uris;
    }
  }

  getGatewayUrls(): GatewayUrls {
    return this.gatewayUrls;
  }
}
