import {
  FeatureName,
  FeatureWithEnabled,
} from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";

/**
 * Checks whether the given ABI supports a given feature
 * @deprecated use isExtensionEnabled instead
 * @param abi - The abi to check
 * @param featureName - The feature name to check
 * @internal
 */
export function isFeatureEnabled(
  abi: AbiInput,
  featureName: FeatureName,
  features: Record<string, FeatureWithEnabled>,
): boolean {
  return _featureEnabled(features, featureName);
}

/**
 * Checks whether the given ABI supports a given extension
 * @public
 * @param abi - The abi to check
 * @param featureName - The feature name to check
 */
export function isExtensionEnabled(
  abi: AbiInput,
  featureName: FeatureName,
  features: Record<string, FeatureWithEnabled>,
) {
  return isFeatureEnabled(abi, featureName, features);
}

/**
 * Searches the feature map for featureName and returns whether its enabled
 * @internal
 * @param features - The feature map to search
 * @param featureName - The feature name to search for
 */
function _featureEnabled(
  features: Record<string, FeatureWithEnabled>,
  featureName: FeatureName,
): boolean {
  const keys = Object.keys(features);
  if (!keys.includes(featureName)) {
    let found = false;
    for (const key of keys) {
      const f = features[key];
      found = _featureEnabled(
        f.features as Record<string, FeatureWithEnabled>,
        featureName,
      );
      if (found) {
        break;
      }
    }
    return found;
  }
  const feature = features[featureName];
  return feature.enabled;
}
