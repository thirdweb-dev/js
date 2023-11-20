import {
  FeatureName,
  FeatureWithEnabled,
} from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";
import { detectFeatures } from "./detectFeatures";

/**
 * Checks whether the given ABI supports a given feature
 * @deprecated use isExtensionEnabled instead
 * @param abi - The abi to check
 * @param featureName - The feature name to check
 */
export function isFeatureEnabled(
  abi: AbiInput,
  featureName: FeatureName,
): boolean {
  const features = detectFeatures(abi);
  return _featureEnabled(features, featureName);
}

/**
 * Checks whether the given ABI supports a given extension
 * @public
 * @param abi - The abi to check
 * @param featureName - The feature name to check
 */
export function isExtensionEnabled(abi: AbiInput, featureName: FeatureName) {
  return isFeatureEnabled(abi, featureName);
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
