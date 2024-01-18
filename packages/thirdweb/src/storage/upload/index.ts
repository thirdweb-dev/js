import type { RawClient } from "../../client/client.js";
import { buildFormData, isBrowser } from "./helpers.js";
import type { UploadOptions } from "./types.js";

export async function upload(client: RawClient, options: UploadOptions) {
  const form_ = new FormData();

  const { fileNames, form } = buildFormData(form_, options.files, options);
  if (isBrowser()) {
    const { uploadBatchBrowser } = await import("./browser.js");
    return await uploadBatchBrowser(client, form, fileNames, options);
  }
  const { uploadBatchNode } = await import("./node.js");
  return uploadBatchNode(client, form, fileNames, options);
}
