import { stringify } from "../../utils/json.js";
import type { UploadOptions } from "../upload.js";
import {
  buildFormData,
  extractObjectFiles,
  isFileOrUint8Array,
  replaceObjectFilesWithUris,
  replaceObjectGatewayUrlsWithSchemes,
} from "./helpers.js";
import type { FileOrBufferOrString } from "./types.js";

type PinataUploadOptions = UploadOptions & {
  batchSize?: number | 100;
};

type PinataUploadResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};

/**
 * A drop-in replacement for thirdweb/storage/upload.js
 * @param options Options
 * @returns something
 * @example
 * ```ts
 * let test = true;
 * ```
 */
export async function uploadBatchNodeWithPinata(
  options: PinataUploadOptions,
): Promise<string[]> {
  if (!options.pinataJwt) {
    console.error("Missing Pinata JWT");
    return [];
  }
  if (options.files.length) {
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
      const uris_ = await uploadBatchNodeWithPinata({ ...options, files });

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

  let ipfsHashes: string[] = [];
  /**
   * According to the docs, there is a limit of 250 items that can be in the queue at once.
   * But to keep a safe margin, we will be splitting the load into batches of (only) 100 items
   * and load them sequentially
   */
  const batchSize: number = options.batchSize || 100;
  const uriBatches: FileOrBufferOrString[][] = Array.from(
    { length: Math.ceil(uris.length / batchSize) },
    (_, i) => uris.slice(i * batchSize, (i + 1) * batchSize),
  );
  uriBatches.forEach(async (batch) => {
    const requests = batch.map((_uri) => {
      const form_ = new FormData();
      const { form } = buildFormData(form_, [_uri], options);
      const res = fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.pinataJwt}`,
        },
        body: form,
      }).then((item) => item.json());
      return res;
    });
    const responses: PinataUploadResponse[] = await Promise.all(requests);
    ipfsHashes = ipfsHashes.concat(responses.map((item) => item.IpfsHash));
  });

  return ipfsHashes;
}
