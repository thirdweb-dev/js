import type { ThirdwebClient } from "../client/client.js";
import { detectPlatform } from "../utils/detect-platform.js";
import { stringify } from "../utils/json.js";
import {
  buildFormData,
  extractObjectFiles,
  isFileOrUint8Array,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
} from "./upload/helpers.js";
import type {
  FileOrBufferOrString,
  UploadOptions as InternalUploadOptions,
} from "./upload/types.js";

export type UploadOptions = InternalUploadOptions & {
  client: ThirdwebClient;
};

/**
 * Uploads files based on the provided options.
 * @param options - The upload options.
 * @returns A promise that resolves to an array of uploaded file URIs.
 * @throws An error if the upload fails.
 * @example
 * ```ts
 * import { upload } from "thirdweb/storage";
 * const uris = await upload({
 *  client,
 *  files: [
 *    new File(["hello world"], "hello.txt"),
 *  ],
 * });
 * ```
 * @storage
 */
export async function upload(options: UploadOptions) {
  // deal with the differnt file types

  // if there are no files, return an empty array immediately
  if (!options.files.length) {
    return [];
  }
  // handle file arrays
  const isFileArray = options.files
    .map((item) => isFileOrUint8Array(item) || typeof item === "string")
    .every((item) => !!item);

  let uris: FileOrBufferOrString[];

  if (isFileArray) {
    // if we already have an array of files, we can just pass it through
    uris = options.files as FileOrBufferOrString[];
  } else {
    // otherwise we have to process them first
    let cleaned = options.files as unknown[];

    // Replace any gateway URLs with their hashes
    cleaned = replaceObjectGatewayUrlsWithSchemes(cleaned);

    // Recurse through data and extract files to upload
    const files = extractObjectFiles(cleaned);
    if (files.length) {
      // Upload all files that came from the object
      const uris_ = await upload({ ...options, files });

      // Recurse through data and replace files with hashes
      cleaned = replaceObjectFilesWithUris(cleaned, uris_) as unknown[];
    }

    uris = cleaned.map((item) => {
      if (typeof item === "string") {
        return item;
      }
      return stringify(item);
    });
  }

  // end deal with the differnt file types
  const form_ = new FormData();

  const { fileNames, form } = buildFormData(form_, uris, options);

  const platform = detectPlatform();
  if (platform === "browser" || platform === "node") {
    const { uploadBatch } = await import("./upload/web-node.js");
    return await uploadBatch(options.client, form, fileNames, options);
  }
  throw new Error(
    "Please, use the uploadMobile function in mobile environments.",
  );
}
