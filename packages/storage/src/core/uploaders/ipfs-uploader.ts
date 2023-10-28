import { TW_UPLOAD_SERVER_URL } from "../../common/urls";
import {
  isBrowser,
  isBufferOrStringWithName,
  isFileBufferOrStringEqual,
  isFileInstance,
} from "../../common/utils";
import FormData from "form-data";
import pkg from "../../../package.json";
import {
  IStorageUploader,
  IpfsUploadBatchOptions,
  IpfsUploaderOptions,
} from "../../types/upload";
import { FileOrBufferOrString } from "../../types/data";

/**
 * Default uploader used - handles uploading arbitrary data to IPFS
 *
 * @example
 * ```jsx
 * // Can instantiate the uploader with default configuration and your client ID when used in client-side applications
 * const uploader = new StorageUploader();
 * const clientId = "your-client-id";
 * const storage = new ThirdwebStorage({ clientId, uploader });
 *
 * // Can instantiate the uploader with default configuration and your secret key when used in server-side applications
 * const uploader = new StorageUploader();
 * const secretKey = "your-secret-key";
 * const storage = new ThirdwebStorage({ secretKey, uploader });
 *
 * // Or optionally, can pass configuration
 * const options = {
 *   // Upload objects with resolvable URLs
 *   uploadWithGatewayUrl: true,
 * }
 * const uploader = new StorageUploader(options);
 * const clientId = "your-client-id";
 * const storage = new ThirdwebStorage({ clientId, uploader });
 * ```
 *
 * @public
 */
export class IpfsUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  public uploadWithGatewayUrl: boolean;
  private uploadServerUrl: string;
  private clientId?: string;
  private secretKey?: string;

  constructor(options?: IpfsUploaderOptions) {
    this.uploadWithGatewayUrl = options?.uploadWithGatewayUrl || false;
    this.uploadServerUrl = options?.uploadServerUrl || TW_UPLOAD_SERVER_URL;
    this.clientId = options?.clientId;
    this.secretKey = options?.secretKey;
  }

  async uploadBatch(
    data: FileOrBufferOrString[],
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
    if (options?.uploadWithoutDirectory && data.length > 1) {
      throw new Error(
        "[UPLOAD_WITHOUT_DIRECTORY_ERROR] Cannot upload more than one file or object without directory!",
      );
    }

    const formData = new FormData();
    const { form, fileNames } = this.buildFormData(formData, data, options);

    if (isBrowser()) {
      return this.uploadBatchBrowser(form, fileNames, options);
    } else {
      return this.uploadBatchNode(form, fileNames, options);
    }
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

    return {
      form,
      // encode the file names on the way out (which is what the upload backend expects)
      fileNames: fileNames.map((fName) => encodeURIComponent(fName)),
    };
  }

  private async uploadBatchBrowser(
    form: FormData,
    fileNames: string[],
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
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
            return resolve(fileNames.map((n) => `ipfs://${cid}/${n}`));
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
          return reject(new Error("Upload failed due to a network error."));
        }

        return reject(new Error("Unknown upload error occured"));
      });

      xhr.open("POST", `${this.uploadServerUrl}/ipfs/upload`);

      if (this.secretKey) {
        xhr.setRequestHeader("x-secret-key", this.secretKey);
      } else if (this.clientId) {
        xhr.setRequestHeader("x-client-id", this.clientId);
      }

      const bundleId =
        typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis
          ? ((globalThis as any).APP_BUNDLE_ID as string)
          : undefined;
      if (bundleId) {
        xhr.setRequestHeader("x-bundle-id", bundleId);
      }

      xhr.setRequestHeader("x-sdk-version", pkg.version);
      xhr.setRequestHeader("x-sdk-name", pkg.name);
      xhr.setRequestHeader(
        "x-sdk-platform",
        bundleId
          ? "react-native"
          : isBrowser()
          ? (window as any).bridge !== undefined
            ? "webGL"
            : "browser"
          : "node",
      );

      // if we have a authorization token on global context then add that to the headers, this is for the dashboard.
      if (
        typeof globalThis !== "undefined" &&
        "TW_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_AUTH_TOKEN === "string"
      ) {
        xhr.setRequestHeader(
          "authorization",
          `Bearer ${(globalThis as any).TW_AUTH_TOKEN as string}`,
        );
      }

      // CLI auth token
      if (
        typeof globalThis !== "undefined" &&
        "TW_CLI_AUTH_TOKEN" in globalThis &&
        typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
      ) {
        xhr.setRequestHeader(
          "authorization",
          `Bearer ${(globalThis as any).TW_CLI_AUTH_TOKEN as string}`,
        );
        xhr.setRequestHeader("x-authorize-wallet", `true`);
      }

      xhr.send(form as any);
    });
  }

  private async uploadBatchNode(
    form: FormData,
    fileNames: string[],
    options?: IpfsUploadBatchOptions,
  ) {
    if (options?.onProgress) {
      console.warn("The onProgress option is only supported in the browser");
    }

    const headers: HeadersInit = {};

    if (this.secretKey) {
      headers["x-secret-key"] = this.secretKey;
    } else if (this.clientId) {
      headers["x-client-id"] = this.clientId;
    }

    // if we have a bundle id on global context then add that to the headers
    if (typeof globalThis !== "undefined" && "APP_BUNDLE_ID" in globalThis) {
      headers["x-bundle-id"] = (globalThis as any).APP_BUNDLE_ID as string;
    }

    // if we have a authorization token on global context then add that to the headers, this is for the dashboard.
    if (
      typeof globalThis !== "undefined" &&
      "TW_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_AUTH_TOKEN === "string"
    ) {
      headers["authorization"] = `Bearer ${
        (globalThis as any).TW_AUTH_TOKEN as string
      }`;
    }

    // CLI auth token
    if (
      typeof globalThis !== "undefined" &&
      "TW_CLI_AUTH_TOKEN" in globalThis &&
      typeof (globalThis as any).TW_CLI_AUTH_TOKEN === "string"
    ) {
      headers["authorization"] = `Bearer ${
        (globalThis as any).TW_CLI_AUTH_TOKEN as string
      }`;
      headers["x-authorize-wallet"] = "true";
    }

    const res = await fetch(`${this.uploadServerUrl}/ipfs/upload`, {
      method: "POST",
      headers: {
        ...headers,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error(
          "Unauthorized - You don't have permission to use this service.",
        );
      }
      throw new Error(
        `Failed to upload files to IPFS - ${res.status} - ${
          res.statusText
        } - ${await res.text()}`,
      );
    }

    const body = await res.json();

    const cid = body.IpfsHash;
    if (!cid) {
      throw new Error("Failed to upload files to IPFS - Bad CID");
    }

    if (options?.uploadWithoutDirectory) {
      return [`ipfs://${cid}`];
    } else {
      return fileNames.map((name) => `ipfs://${cid}/${name}`);
    }
  }
}
