import packageJson from "../../../package.json";
import { detectOS } from "./isMobile";

export function getAnalyticsGlobals() {
  if (typeof globalThis === "undefined") {
    return {
      x_sdk_name: packageJson.name,
      x_sdk_platform: "browser",
      x_sdk_version: packageJson.version,
      x_sdk_os: detectOS(),
      app_bundle_id: undefined,
    };
  }

  if ((globalThis as any).X_SDK_NAME === undefined) {
    (globalThis as any).X_SDK_NAME = packageJson.name;
    (globalThis as any).X_SDK_PLATFORM = "browser";
    (globalThis as any).X_SDK_VERSION = packageJson.version;
    (globalThis as any).X_SDK_OS = detectOS();
    (globalThis as any).APP_BUNDLE_ID = undefined;
  }

  return {
    x_sdk_name: (globalThis as any).X_SDK_NAME,
    x_sdk_platform: (globalThis as any).X_SDK_PLATFORM,
    x_sdk_version: (globalThis as any).X_SDK_VERSION,
    x_sdk_os: (globalThis as any).X_SDK_OS,
    app_bundle_id: (globalThis as any).APP_BUNDLE_ID,
  };
}
