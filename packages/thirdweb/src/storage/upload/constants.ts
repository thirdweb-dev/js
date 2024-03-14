import type { ThirdwebClient } from "../../client/client.js";

/**
 * Constructs the endpoint to upload a file to ipfs
 * @internal
 */
export const getUploadServerUrl = (client: ThirdwebClient) =>
  client.config?.baseUrls?.storage ?? "storage.thirdweb.com";
