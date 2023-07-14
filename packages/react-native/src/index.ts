import DeviceInfo from "react-native-device-info";

export * from "./evm";

// @ts-ignore
globalThis.APP_BUNDLE_ID = DeviceInfo.getBundleId();
