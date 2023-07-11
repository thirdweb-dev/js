import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { isFeatureEnabled } from "../feature-detection/isFeatureEnabled";

export function isRouterContract(abi: Abi) {
  const isPluginRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "PluginRouter",
  );
  const isExtensionRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "ExtensionRouter",
  );
  return isExtensionRouter || isPluginRouter;
}
