import { getThirdwebDomainOverrides } from "../../utils/domains.js";

/**
 * Constructs the endpoint to upload a file to ipfs
 * @internal
 */
export const getUploadServerUrl = () =>
  getThirdwebDomainOverrides()?.storage ?? "storage.thirdweb.com";
