import { DeploymentPreset } from "../../types/any-evm/deploy-data";

type Caches = {
  deploymentPresets: Record<string, DeploymentPreset>;
  deployMetadataCache: Record<string, any>;
  uriCache: Record<string, string>;
};

export const caches: Caches = {
  deploymentPresets: {},
  deployMetadataCache: {},
  uriCache: {},
};
