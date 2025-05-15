import { getThirdwebDomains } from "../utils/domains.js";

const getBridgeBaseUrl = () => {
  const bridgeDomain: string = getThirdwebDomains().bridge;
  return bridgeDomain.startsWith("localhost")
    ? `http://${bridgeDomain}`
    : `https://${bridgeDomain}`;
};

export const UNIVERSAL_BRIDGE_URL = `${getBridgeBaseUrl()}/v1`;
