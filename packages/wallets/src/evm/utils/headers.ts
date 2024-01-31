import pkg from "../../../../../package.json";
import { getOperatingSystem } from "./os/os";

export function setAnalyticsHeaders(headers: Record<string, string>) {
  const globals = getAnalyticsGlobals();

  headers["x-sdk-version"] = globals.x_sdk_version;
  headers["x-sdk-name"] = globals.x_sdk_name;
  headers["x-sdk-platform"] = globals.x_sdk_platform;
  headers["x-sdk-os"] = globals.x_sdk_os;
}

export function setAnalyticsHeadersForXhr(xhr: XMLHttpRequest) {
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
      x_sdk_name: pkg.name,
      x_sdk_platform: getPlatform(),
      x_sdk_version: pkg.version,
      x_sdk_os: getOperatingSystem(),
      app_bundle_id: undefined,
    };
  }

  if ((globalThis as any).X_SDK_NAME === undefined) {
    (globalThis as any).X_SDK_NAME = pkg.name;
    (globalThis as any).X_SDK_PLATFORM = getPlatform();
    (globalThis as any).X_SDK_VERSION = pkg.version;
    (globalThis as any).X_SDK_OS = getOperatingSystem();
    (globalThis as any).APP_BUNDLE_ID = undefined;
  }

  return {
    x_sdk_name: (globalThis as any).X_SDK_NAME,
    x_sdk_platform: (globalThis as any).X_SDK_PLATFORM,
    x_sdk_version: (globalThis as any).X_SDK_VERSION,
    x_sdk_os: (globalThis as any).X_SDK_OS,
    app_bundle_id: (globalThis as any).APP_BUNDLE_ID || "", // if not RN, this will be empty
  };
}

export function getPlatform() {
  return typeof navigator !== "undefined" && navigator.product === "ReactNative"
    ? "mobile"
    : typeof window !== "undefined"
      ? "browser"
      : "node";
}
