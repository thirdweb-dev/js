import {
  PINATA_IPFS_URL,
  prepareGatewayUrls,
  TW_IPFS_SERVER_URL,
} from "../../common/urls";
import {
  isBrowser,
  isBufferOrStringWithName,
  isFileInstance,
} from "../../common/utils";
import {
  FileOrBuffer,
  GatewayUrls,
  IpfsUploadBatchOptions,
  IpfsUploaderOptions,
  IStorageUploader,
} from "../../types";
import fetch from "cross-fetch";
import FormData from "form-data";

export class IpfsUploader implements IStorageUploader {
  public gatewayUrls: GatewayUrls;
  public uploadWithGatewayUrl: boolean;

  constructor(options?: IpfsUploaderOptions) {
    this.gatewayUrls = prepareGatewayUrls(options?.gatewayUrls);
    this.uploadWithGatewayUrl = options?.uploadWithGatewayUrl || false;
  }

  async uploadBatch(
    data: (string | FileOrBuffer)[],
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
    const form = new FormData();
    const { fileNames } = this.buildFormData(form, data);

    if (isBrowser()) {
      return this.uploadBatchBrowser(form, fileNames, options);
    } else {
      return this.uploadBatchNode(form, fileNames, options);
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
    });
    if (!res.ok) {
      throw new Error(`Failed to get upload token`);
    }
    const body = await res.text();
    return body;
  }

  private buildFormData(
    form: FormData,
    files: (string | FileOrBuffer)[],
    options?: IpfsUploadBatchOptions,
  ) {
    const fileNames: string[] = [];
    files.forEach((file, i) => {
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

      const filepath = `files/${fileName}`;
      if (fileNames.indexOf(fileName) > -1) {
        throw new Error(
          `[DUPLICATE_FILE_NAME_ERROR] File name ${fileName} was passed for more than one file.`,
        );
      }

      fileNames.push(fileName);
      if (!isBrowser()) {
        form.append("file", fileData as any, { filepath } as any);
      } else {
        // browser does blob things, filepath is parsed differently on browser vs node.
        // pls pinata?
        form.append("file", new Blob([fileData as any]), filepath);
      }
    });

    return {
      form,
      fileNames,
    };
  }

  private async uploadBatchBrowser(
    form: FormData,
    fileNames: string[],
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
    const token = await this.getUploadToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", PINATA_IPFS_URL);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.onloadend = () => {
        if (xhr.status !== 200) {
          throw new Error("Failed to upload files to IPFS");
        }

        const cid = JSON.parse(xhr.responseText).IpfsHash;
        if (!cid) {
          throw new Error("Failed to upload files to IPFS");
        }

        resolve(fileNames.map((name) => `ipfs://${cid}/${name}`));
      };

      xhr.onerror = (err) => {
        reject(err);
      };

      if (xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (options?.onProgress) {
            options?.onProgress({
              progress: event.loaded,
              total: event.total,
            });
          }
        };
      }

      xhr.send(form as any);
    });
  }

  private async uploadBatchNode(
    form: FormData,
    fileNames: string[],
    options?: IpfsUploadBatchOptions,
  ) {
    const token = await this.getUploadToken();

    if (options?.onProgress) {
      console.warn("The onProgress option is only supported in the browser");
    }
    const res = await fetch(PINATA_IPFS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
      },
      body: form.getBuffer(),
    });
    const body = await res.json();
    if (!res.ok) {
      throw new Error("Failed to upload files to IPFS");
    }

    const cid = body.IpfsHash;
    if (!cid) {
      throw new Error("Failed to upload files to IPFS");
    }

    return fileNames.map((name) => `ipfs://${cid}/${name}`);
  }
}
