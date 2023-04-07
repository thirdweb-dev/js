import {getCIDForUpload, IPFS_UPLOAD_GATEWAYS, isUploaded, PINATA_IPFS_URL} from "../../common";
import { TW_IPFS_SERVER_URL } from "../../common/urls";
import {
  isBrowser,
  isBufferOrStringWithName,
  isFileBufferOrStringEqual,
  isFileInstance,
} from "../../common/utils";
import {
  FileOrBufferOrString,
  IpfsUploadBatchOptions,
  IpfsUploaderOptions,
  IStorageUploader,
} from "../../types";
import fetch from "cross-fetch";
import FormData from "form-data";

/**
 * Default uploader used - handles uploading arbitrary data to IPFS
 *
 * @example
 * ```jsx
 * // Can instantiate the uploader with default configuration
 * const uploader = new StorageUploader();
 * const storage = new ThirdwebStorage({ uploader });
 *
 * // Or optionally, can pass configuration
 * const options = {
 *   // Upload objects with resolvable URLs
 *   uploadWithGatewayUrl: true,
 * }
 * const uploader = new StorageUploader(options);
 * const storage = new ThirdwebStorage({ uploader });
 * ```
 *
 * @public
 */
export class IpfsUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  public uploadWithGatewayUrl: boolean;

  constructor(options?: IpfsUploaderOptions) {
    this.uploadWithGatewayUrl = options?.uploadWithGatewayUrl || false;
  }

  async uploadBatch(
    data: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions
  ): Promise<string[]> {
    if (options?.uploadWithoutDirectory && data.length > 1) {
      throw new Error(
        "[UPLOAD_WITHOUT_DIRECTORY_ERROR] Cannot upload more than one file or object without directory!",
      );
    }

    const formData = new FormData();
    const { form, fileNames } = this.buildFormData(formData, data, options);

    try {
      const cid = await getCIDForUpload(
        data,
        fileNames.map((name) => decodeURIComponent(name)),
        !options?.uploadWithoutDirectory,
      );
      if ((await isUploaded(cid)) && !options?.alwaysUpload) {
        if (options?.onProgress) {
          options?.onProgress({
            progress: 100,
            total: 100,
          });
        }

        if (options?.uploadWithoutDirectory) {
          return [`ipfs://${cid}`];
        } else {
          return fileNames.map((name) => `ipfs://${cid}/${name}`);
        }
      }
    } catch {
      // no-op
    }

    return this.uploadBatchAndRetryIfNeeded(form, fileNames, options);
  }

  private async uploadBatchAndRetryIfNeeded(
    form: FormData,
    fileNames: string[],
    options?: IpfsUploadBatchOptions,
    gatewayIndex: number = 0,
  ): Promise<string[]> {
    const ipfsUploadUrl = IPFS_UPLOAD_GATEWAYS[gatewayIndex];
    if (!ipfsUploadUrl) {
      throw new Error(
        "[UPLOAD_ERROR] Failed to upload to IPFS - all gateways failed",
      );
    }

    if (ipfsUploadUrl === PINATA_IPFS_URL) {
      this.addPinataSpecificFormData(form, options);
    }

    try {
      if (isBrowser()) {
        return this.uploadBatchBrowser(form, fileNames, ipfsUploadUrl, options);
      } else {
        return this.uploadBatchNode(form, fileNames, ipfsUploadUrl, options);
      }
    } catch (e) {
      console.warn('Retrying IPFS upload -', e);
      return this.uploadBatchAndRetryIfNeeded(form, fileNames, options, gatewayIndex + 1);
    }
  }

  private addPinataSpecificFormData(form: FormData, options?: IpfsUploadBatchOptions) {
    const metadata = {
      name: `Storage SDK`,
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
  }

  /**
   * Fetches a one-time-use upload token that can used to upload
   * a file to storage.
   *
   * @returns - The one time use token that can be passed to the Pinata API.
   */
  private async getUploadToken(): Promise<string> {
    const res = await fetch(`${TW_IPFS_SERVER_URL}/grant`, {
      method: "GET",
      headers: {
        "X-APP-NAME":
          // eslint-disable-next-line turbo/no-undeclared-env-vars
          process.env.NODE_ENV === "test" || !!process.env.CI
            ? "Storage SDK CI"
            : "Storage SDK",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to get upload token`);
    }
    const body = await res.text();
    return body;
  }

  private buildFormData(
    form: FormData,
    files: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions,
  ) {
    const fileNameToFileMap = new Map<string, FileOrBufferOrString>();
    const fileNames: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = "";
      let fileData = file;

      if (isFileInstance(file)) {
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
      } else if (isBufferOrStringWithName(file)) {
        fileData = file.data;
        if (options?.rewriteFileNames) {
          fileName = `${i + options.rewriteFileNames.fileStartNumber}`;
        } else {
          fileName = `${file.name}`;
        }
      } else {
        if (options?.rewriteFileNames) {
          fileName = `${i + options.rewriteFileNames.fileStartNumber}`;
        } else {
          fileName = `${i}`;
        }
      }

      // If we don't want to wrap with directory, adjust the filepath
      const filepath = options?.uploadWithoutDirectory
        ? `files`
        : `files/${fileName}`;

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
      if (!isBrowser()) {
        form.append("file", fileData as any, { filepath } as any);
      } else {
        // browser does blob things, filepath is parsed differently on browser vs node.
        // pls pinata?
        form.append("file", new Blob([fileData as any]), filepath);
      }
    }

    return {
      form,
      // encode the file names on the way out (which is what the upload backend expects)
      fileNames: fileNames.map((fName) => encodeURIComponent(fName)),
    };
  }

  private async uploadBatchBrowser(
    form: FormData,
    fileNames: string[],
    ipfsUploadUrl: string,
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
    // Pinata is the only service that needs a token for uploads (for now)
    const uploadToken =
      ipfsUploadUrl === PINATA_IPFS_URL
        ? await this.getUploadToken()
        : undefined

    return new Promise((resolve, reject) => {
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

        if (event.lengthComputable && options?.onProgress) {
          options?.onProgress({
            progress: event.loaded,
            total: event.total,
          });
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

          if (options?.uploadWithoutDirectory) {
            return resolve([`ipfs://${cid}`]);
          } else {
            return resolve(fileNames.map((name) => `ipfs://${cid}/${name}`));
          }
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
              "This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.",
            ),
          );
        }

        return reject(new Error("Unknown upload error occured"));
      });

      xhr.open("POST", ipfsUploadUrl);

      if (uploadToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${uploadToken}`);
      }

      xhr.send(form as any);
    });
  }

  private async uploadBatchNode(
    form: FormData,
    fileNames: string[],
    ipfsUploadUrl: string,
    options?: IpfsUploadBatchOptions,
  ) {
    const token = await this.getUploadToken();

    if (options?.onProgress) {
      console.warn("The onProgress option is only supported in the browser");
    }
    const res = await fetch(ipfsUploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    if (!res.ok) {
      console.warn(await res.text());
      throw new Error("Failed to upload files to IPFS");
    }

    const body = await res.json();

    const cid = body.IpfsHash;
    if (!cid) {
      throw new Error("Failed to upload files to IPFS");
    }

    if (options?.uploadWithoutDirectory) {
      return [`ipfs://${cid}`];
    } else {
      return fileNames.map((name) => `ipfs://${cid}/${name}`);
    }
  }
}
