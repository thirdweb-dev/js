import { DEFAULT_GATEWAY_URLS, GatewayUrls } from "@thirdweb-dev/storage";
import { Platform } from "react-native";
import { appBundleId, packageVersion } from "../../evm/utils/version";

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

export function setAnalyticsHeaders(xhr: XMLHttpRequest) {
  const globals = getAnalyticsGlobals();
  xhr.setRequestHeader("x-sdk-version", globals.x_sdk_version);
  xhr.setRequestHeader("x-sdk-os", globals.x_sdk_os);
  xhr.setRequestHeader("x-sdk-name", globals.x_sdk_name);
  xhr.setRequestHeader("x-sdk-platform", globals.x_sdk_platform);
  xhr.setRequestHeader("x-bundle-id", globals.app_bundle_id);
}

export function getAnalyticsHeaders() {
  const globals = getAnalyticsGlobals();
  return {
    "x-sdk-version": globals.x_sdk_version,
    "x-sdk-os": globals.x_sdk_os,
    "x-sdk-name": globals.x_sdk_name,
    "x-sdk-platform": globals.x_sdk_platform,
    "x-bundle-id": globals.app_bundle_id,
  };
}

export function getAnalyticsGlobals() {
  if (typeof globalThis === "undefined") {
    return {
      x_sdk_name: packageVersion.name,
      x_sdk_platform: "mobile",
      x_sdk_version: packageVersion.version,
      x_sdk_os: Platform.OS,
      app_bundle_id: appBundleId,
    };
  }

  if ((globalThis as any).X_SDK_NAME === undefined) {
    (globalThis as any).X_SDK_NAME = packageVersion.name;
    (globalThis as any).X_SDK_PLATFORM = "mobile";
    (globalThis as any).X_SDK_VERSION = packageVersion.version;
    (globalThis as any).X_SDK_OS = Platform.OS;
    (globalThis as any).APP_BUNDLE_ID = appBundleId;
  }

  return {
    x_sdk_name: (globalThis as any).X_SDK_NAME,
    x_sdk_platform: (globalThis as any).X_SDK_PLATFORM,
    x_sdk_version: (globalThis as any).X_SDK_VERSION,
    x_sdk_os: (globalThis as any).X_SDK_OS,
    app_bundle_id: (globalThis as any).APP_BUNDLE_ID,
  };
}
