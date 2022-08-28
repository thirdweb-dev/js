import { PINATA_IPFS_URL, TW_IPFS_SERVER_URL } from "../constants/urls";
import { CidWithFileName, IStorageUpload } from "../interfaces/IStorageUpload";
import { FileOrBuffer } from "../types";
import { UploadProgressEvent } from "../types/events";
import { File } from "@web-std/file";
import FormData from "form-data";

/**
 * @internal
 */
export class PinataUploader implements IStorageUpload {
  /**
   * Fetches a one-time-use upload token that can used to upload
   * a file to storage.
   *
   * @returns - The one time use token that can be passed to the Pinata API.
   */
  public async getUploadToken(contractAddress: string): Promise<string> {
    const headers = {
      "X-App-Name": `CONSOLE-TS-SDK-${contractAddress}`,
    };
    const res = await fetch(`${TW_IPFS_SERVER_URL}/grant`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      throw new Error(`Failed to get upload token`);
    }
    const body = await res.text();
    return body;
  }

  public async uploadBatchWithCid(
    files: (string | FileOrBuffer)[],
    fileStartNumber = 0,
    contractAddress?: string,
    signerAddress?: string,
    options?: {
      onProgress: (event: UploadProgressEvent) => void;
    }
  ): Promise<CidWithFileName> {
    const token = await this.getUploadToken(contractAddress || "");

    const formData = new FormData();
    const { data, fileNames } = this.buildFormData(
      formData,
      files,
      fileStartNumber,
      contractAddress,
      signerAddress
    );

    if (typeof window === "undefined") {
      if (options?.onProgress) {
        console.warn("The onProgress option is only supported in the browser");
      }
      const res = await fetch(PINATA_IPFS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...data.getHeaders(),
        },
        body: data.getBuffer(),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error("Failed to upload files to IPFS");
      }

      const cid = body.IpfsHash;
      if (!cid) {
        throw new Error("Failed to upload files to IPFS");
      }

      return {
        cid,
        fileNames,
      };
    } else {
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

          resolve({
            cid,
            fileNames,
          });
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

        xhr.send(data);
      });
    }
  }

  private buildFormData(
    data: any,
    files: (string | FileOrBuffer)[],
    fileStartNumber = 0,
    contractAddress?: string,
    signerAddress?: string
  ) {
    const metadata = {
      name: `CONSOLE-TS-SDK-${contractAddress}`,
      keyvalues: {
        sdk: "typescript",
        contractAddress,
        signerAddress,
      },
    };

    const fileNames: string[] = [];
    files.forEach((file, i) => {
      let fileName = "";
      let fileData = file;
      // if it is a file, we passthrough the file extensions,
      // if it is a buffer or string, the filename would be fileStartNumber + index
      // if it is a buffer or string with names, the filename would be the name
      if (file instanceof File) {
        let extensions = "";
        if (file.name) {
          const extensionStartIndex = file.name.lastIndexOf(".");
          if (extensionStartIndex > -1) {
            extensions = file.name.substring(extensionStartIndex);
          }
        }
        fileName = `${i + fileStartNumber}${extensions}`;
      } else if (file instanceof Buffer || typeof file === "string") {
        fileName = `${i + fileStartNumber}`;
      } else if (file && file.name && file?.data) {
        fileData = file?.data;
        fileName = `${file.name}`;
      } else {
        // default behavior
        fileName = `${i + fileStartNumber}`;
      }

      const filepath = `files/${fileName}`;
      if (fileNames.indexOf(fileName) > -1) {
        throw new Error(
          `DUPLICATE_FILE_NAME_ERROR: File name ${fileName} was passed for more than one file.`
        );
      }
      fileNames.push(fileName);
      if (typeof window === "undefined") {
        data.append("file", fileData as any, { filepath } as any);
      } else {
        // browser does blob things, filepath is parsed differently on browser vs node.
        // pls pinata?
        data.append("file", new Blob([fileData as any]), filepath);
      }
    });

    data.append("pinataMetadata", JSON.stringify(metadata));

    return {
      data,
      fileNames,
    };
  }
}
