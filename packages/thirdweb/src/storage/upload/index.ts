import { stringify } from "../../utils/json.js";
import type { RawClient } from "../../client/client.js";
import {
  buildFormData,
  extractObjectFiles,
  isBrowser,
  isFileOrUint8Array,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
} from "./helpers.js";
import type { FileOrBufferOrString, UploadOptions } from "./types.js";

export async function upload(client: RawClient, options: UploadOptions) {
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
      const uris_ = await upload(client, { ...options, files });

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
  // default uploadWithoutDirectory to true if there is only one file and the option is not set explicitly
  options.uploadWithoutDirectory =
    options.uploadWithoutDirectory ?? fileNames.length === 1;
  if (isBrowser()) {
    const { uploadBatchBrowser } = await import("./browser.js");
    return await uploadBatchBrowser(client, form, fileNames, options);
  }
  const { uploadBatchNode } = await import("./node.js");
  return uploadBatchNode(client, form, fileNames, options);
}
