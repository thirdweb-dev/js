export function isGlobalThisPresent() {
    return typeof globalThis !== "undefined";
}

export function isAppBundleIdPresentInGlobal() {
    return isGlobalThisPresent() && "APP_BUNDLE_ID" in globalThis;
}
