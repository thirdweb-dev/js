import type { ThirdwebClient } from "../../client/client.js";
import { getThirdwebDomains } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import { IS_TEST } from "../../utils/process.js";
import { addToMockStorage } from "../mock.js";
import type { UploadableFile, UploadOptions } from "./types.js";

export async function uploadBatch<const TFiles extends UploadableFile[]>(
  client: ThirdwebClient,
  form: FormData,
  fileNames: string[],
  options?: UploadOptions<TFiles>,
) {
  if (IS_TEST) {
    return addToMockStorage(form);
  }

  const headers: HeadersInit = {};

  const res = await getClientFetch(client)(
    `https://${getThirdwebDomains().storage}/ipfs/upload`,
    {
      body: form,
      headers,
      method: "POST",
      requestTimeoutMs:
        client.config?.storage?.fetch?.requestTimeoutMs || 120000,
      // force auth token usage for storage uploads
      useAuthToken: true,
    },
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Unauthorized - You don't have permission to use this service.",
      );
    }
    if (res.status === 402) {
      throw new Error(
        "You have reached your storage limit. Please add a valid payment method to continue using the service.",
      );
    }
    if (res.status === 403) {
      throw new Error(
        "Forbidden - You don't have permission to use this service.",
      );
    }
    throw new Error(
      `Failed to upload files to IPFS - ${res.status} - ${res.statusText}`,
    );
  }

  const body = await res.json();

  const cid = body.IpfsHash;
  if (!cid) {
    throw new Error("Failed to upload files to IPFS - Bad CID");
  }

  if (options?.uploadWithoutDirectory) {
    return [`ipfs://${cid}`];
  }
  return fileNames.map((name) => `ipfs://${cid}/${name}`);
}
