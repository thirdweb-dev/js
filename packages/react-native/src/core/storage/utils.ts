import { DEFAULT_GATEWAY_URLS, GatewayUrls } from "@thirdweb-dev/storage";

/**
 * @internal
 */
export function prepareGatewayUrls(
  gatewayUrls: GatewayUrls,
  clientId?: string,
): GatewayUrls {
  const allGatewayUrls = {
    ...DEFAULT_GATEWAY_URLS,
    ...gatewayUrls,
  };

  for (const key of Object.keys(allGatewayUrls)) {
    const cleanedGatewayUrls = allGatewayUrls[key]
      .map((url) => {
        // inject clientId when present
        if (clientId && url.includes("{clientId}")) {
          return url.replace("{clientId}", clientId);
        } else if (url.includes("{clientId}")) {
          // if no client id passed, filter out the url
          return undefined;
        } else {
          return url;
        }
      })
      .filter((url) => url !== undefined) as string[];

    allGatewayUrls[key] = cleanedGatewayUrls;
  }

  return allGatewayUrls;
}
