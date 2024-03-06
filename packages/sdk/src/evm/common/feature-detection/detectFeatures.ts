import {
  Feature,
  FeatureWithEnabled,
  SUPPORTED_FEATURES,
} from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";
import { createLruCache } from "../utils";
import { hasMatchingAbi, matchesAbiFromBytecode } from "./hasMatchingAbi";

const lruCache =
  /* @__PURE__ */ createLruCache<Record<string, FeatureWithEnabled>>(10);

/**
 * Processes ALL supported features and sets whether the passed in abi supports each individual feature
 * @internal
 * @param abi - The abi to detect features in
 * @param features - The features to detect
 * @returns The nested struct of all features and whether they're detected in the abi
 */
export function detectFeatures(
  abi: AbiInput,
  features: Record<string, Feature> = SUPPORTED_FEATURES,
): Record<string, FeatureWithEnabled> {
  const cacheKey = JSON.stringify(abi);
  if (lruCache.has(cacheKey)) {
    return lruCache.get(cacheKey) as Record<string, FeatureWithEnabled>;
  }
  const results = detectFeaturesInternal(abi, features);
  lruCache.put(cacheKey, results);
  return results;
}

function detectFeaturesInternal(
  abi: AbiInput,
  features: Record<string, Feature>,
): Record<string, FeatureWithEnabled> {
  const results: Record<string, FeatureWithEnabled> = {};
  for (const featureKey in features) {
    const feature = features[featureKey];
    const enabled = matchesAbiInterface(abi, feature);
    const childResults = detectFeaturesInternal(abi, feature.features);
    results[featureKey] = {
      ...feature,
      features: childResults,
      enabled,
    } as FeatureWithEnabled;
  }
  return results;
}

/**
 * @internal
 */
export function detectFeaturesFromBytecode(
  bytecode: string,
  features: Record<string, Feature> = SUPPORTED_FEATURES,
): Record<string, FeatureWithEnabled> {
  const results: Record<string, FeatureWithEnabled> = {};
  for (const featureKey in features) {
    const feature = features[featureKey];
    const enabled = matchesAbiFromBytecode(bytecode, feature.abis);
    const childResults = detectFeaturesFromBytecode(bytecode, feature.features);
    results[featureKey] = {
      ...feature,
      features: childResults,
      enabled,
    } as FeatureWithEnabled;
  }
  return results;
}

/**
 * @internal
 * @param abi - The abi to check
 * @param feature - The feature to check
 */
function matchesAbiInterface(abi: AbiInput, feature: Feature): boolean {
  // returns true if all the functions in `interfaceToMatch` are found in `contract` (removing any duplicates)
  return hasMatchingAbi(abi, feature.abis);
}
