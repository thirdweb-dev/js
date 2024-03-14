import type { ThirdwebClient } from "../../client/client.js";

export const getUploadServerUrl = (client: ThirdwebClient) =>
  client.config?.baseUrls?.storage ?? "storage.thirdweb.com";
