import type { ThirdwebClient } from "../../client/client.js";
import { getThirdwebDomains } from "../../utils/domains.js";
import { getClientFetch } from "../../utils/fetch.js";
import type { UploadOptions } from "./types.js";

export async function uploadBatch(
  client: ThirdwebClient,
  form: FormData,
  fileNames: string[],
  options?: UploadOptions,
) {
  const headers: HeadersInit = {};

  const res = await getClientFetch(client)(
    `https://${getThirdwebDomains().storage}/ipfs/upload`,
    {
      method: "POST",
      headers: {
        ...headers,
        // ...form.getHeaders(),
      },
      body: form,
    },
  );

  if (!res.ok) {
    res.body?.cancel();
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
  }
  return fileNames.map((name) => `ipfs://${cid}/${name}`);
}
