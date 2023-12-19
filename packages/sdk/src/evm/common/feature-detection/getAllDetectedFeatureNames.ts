import { FeatureWithEnabled } from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";
import { detectFeatures } from "./detectFeatures";
import { extractFeatures } from "./extractFeatures";

/**
 * Return all the detected features names in the abi
 * @param abi - parsed array of abi entries
 * @returns Array of all detected features names
 * @internal
 * @deprecated use getAllExtensionNames instead
 */
export function getAllDetectedFeatureNames(abi: AbiInput): string[] {
  const features: FeatureWithEnabled[] = [];
  extractFeatures(detectFeatures(abi), features);
  return features.map((f) => f.name);
}

/**
 * Return all the detected extension names in the abi
 * @param abi - parsed array of abi entries
 * @returns Array of all detected features names
 * @public
 */
export function getAllDetectedExtensionNames(abi: AbiInput): string[] {
  return getAllDetectedFeatureNames(abi);
}
