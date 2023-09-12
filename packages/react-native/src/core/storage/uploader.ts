import {
  IStorageUploader,
  IpfsUploadBatchOptions,
  isFileBufferOrStringEqual,
  TW_UPLOAD_SERVER_URL,
} from "@thirdweb-dev/storage";
import { IpfsUploaderOptions, UploadDataValue } from "./types";
import * as Application from "expo-application";

const APP_BUNDLE_ID = Application.applicationId;
const METADATA_NAME = "Storage React Native SDK";

export class IpfsUploader implements IStorageUploader<IpfsUploadBatchOptions> {
  public uploadWithGatewayUrl?: boolean | undefined;
  private clientId?: string;

  constructor(options?: IpfsUploaderOptions) {
    this.uploadWithGatewayUrl = options?.uploadWithGatewayUrl || false;
    this.clientId = options?.clientId;
  }

  async uploadBatch(
    data: UploadDataValue[],
    options?: IpfsUploadBatchOptions,
  ): Promise<string[]> {
    if (data.length === 0) {
      throw new Error("[UPLOAD_BATCH_ERROR] No files or objects to upload.");
    }

    // if (options?.uploadWithoutDirectory && data.length > 1) {
    //   throw new Error(
    //     "[UPLOAD_WITHOUT_DIRECTORY_ERROR] Cannot upload more than one file without directory!",
    //   );
    // }

    const metadata = {
      name: METADATA_NAME,
      keyvalues: { ...options?.metadata },
    };

    if ("uri" in data[0] && "type" in data[0] && "name" in data[0]) {
      // then it's an array of files
      return new Promise(async (resolve, reject) => {
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
                `Upload failed due to a network error. ${xhr.responseText}`,
              ),
            );
          }

          return reject(new Error("Unknown upload error occured"));
        });

        xhr.open("POST", `${TW_UPLOAD_SERVER_URL}/ipfs/upload`);
        xhr.setRequestHeader("x-bundle-id", APP_BUNDLE_ID || ""); // only empty on web
        if (this.clientId) {
          xhr.setRequestHeader("x-client-id", this.clientId);
        }

        xhr.send(form);
      });
    } else {
      // assume an array of things
      return new Promise(async (resolve, reject) => {
        const fetchBody = JSON.stringify({
          metadata: metadata,
          content: data,
        });

        try {
          const res = await fetch(`${TW_UPLOAD_SERVER_URL}/ipfs/pin-json`, {
            method: "POST",
            headers: {
              "x-bundle-id": APP_BUNDLE_ID || "", // only empty on web
              ...(this.clientId ? { "x-client-id": this.clientId } : {}),
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
      name: METADATA_NAME,
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
}
