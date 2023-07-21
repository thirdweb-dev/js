import * as Application from "expo-application";
import { isGlobalThisPresent } from "./evm/utils/global";

export * from "./evm";

if (isGlobalThisPresent()) {
  // @ts-ignore
  globalThis.APP_BUNDLE_ID = Application.applicationId;
}
