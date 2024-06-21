import type { ThirdwebClient } from "../client/client.js";
import { uploadBatchMobile } from "./upload/mobile.js";
import type { InternalUploadMobileOptions } from "./upload/types.js";

export type UploadMobileOptions = InternalUploadMobileOptions & {
  client: ThirdwebClient;
};

/**
 * Batch upload arbitrary file or JSON data using the configured decentralized storage system.
 * Automatically uploads any file data within JSON objects and replaces them with hashes.
 * @param options - Options to pass through to the storage uploader class
 * @returns  The URIs of the uploaded data
 * @example
 * ```jsx
 * // Upload an image
 * launchImageLibrary({mediaType: 'photo'}, async response => {
 *   if (response.assets?.[0]) {
 *      const {fileName, type, uri} = response.assets[0];
 *      if (!uri) {
 *        throw new Error('No uri');
 *      }
 *      const resp = await uploadMobile({
 *        uri,
 *        type,
 *        name: fileName,
 *      });
 *    }
 *  });
 *
 * // Upload an array of JSON objects
 * const objects = [
 *  { name: "JSON 1", text: "Hello World" },
 *  { name: "JSON 2", trait: "Awesome" },
 * ];
 * const jsonUris = await uploadMobile(objects);
 * ```
 * @storage
 */
export async function uploadMobile(options: UploadMobileOptions) {
  if (!options) {
    return [];
  }

  const data = options.files.filter((item) => item !== undefined);

  if (!data?.length) {
    return [];
  }

  return await uploadBatchMobile(options.client, data, options);
}
