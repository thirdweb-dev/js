import { Abi, AbiSchema } from "../../schema/contracts/custom";
import { isFeatureEnabled } from "../feature-detection/isFeatureEnabled";

export function isRouterContract(abi: Abi) {
  const isPluginRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "PluginRouter",
  );
  const isBaseRouter: boolean = isFeatureEnabled(
    AbiSchema.parse(abi),
    "DynamicContract",
  );
  return isBaseRouter || isPluginRouter;
}
