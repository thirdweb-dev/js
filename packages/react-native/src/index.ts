import { isGlobalThisPresent } from "./evm/utils/global";
import { appBundleId } from "./evm/utils/version";

export * from "./evm";

if (isGlobalThisPresent()) {
  (globalThis as any).APP_BUNDLE_ID = appBundleId;
}
