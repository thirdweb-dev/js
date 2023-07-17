import * as Application from "expo-application";

export * from "./evm";

// @ts-ignore
globalThis.APP_BUNDLE_ID = Application.applicationId;
