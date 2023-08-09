import * as Application from "expo-application";
import { isGlobalThisPresent } from "./evm/utils/global";

export * from "./evm";

if (isGlobalThisPresent()) {
  (globalThis as any).APP_BUNDLE_ID = Application.applicationId;
}
