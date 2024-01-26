import * as Application from "expo-application";

export const packageVersion: {
  version: string;
  name: string;
  // this is on purpose because we can't import package.json as a module as it is outside rootDir
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("../../../package.json");

export const reactNativePackageVersion = `react-native:${packageVersion.version}`;

export const appBundleId = Application.applicationId || "";
