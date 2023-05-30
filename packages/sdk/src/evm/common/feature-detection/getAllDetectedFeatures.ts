import {
  ExtensionWithEnabled,
  FeatureWithEnabled,
} from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";
import { detectFeatures } from "./detectFeatures";
import { extractFeatures } from "./extractFeatures";

/**
 * Return all the detected features in the abi
 * @param abi - parsed array of abi entries
 * @returns array of all detected extensions with full information on each feature
 * @internal
 * @deprecated use getAllDetectedExtensions instead
 */
export function getAllDetectedFeatures(abi: AbiInput): FeatureWithEnabled[] {
  const features: FeatureWithEnabled[] = [];
  extractFeatures(detectFeatures(abi), features);
  return features;
}

/**
 * Return all the detected extensions in the abi
 * @param abi - parsed array of abi entries
 * @returns array of all detected extensions with full information on each feature
 * @public
 */
export function getAllDetectedExtensions(
  abi: AbiInput,
): ExtensionWithEnabled[] {
  return getAllDetectedFeatures(abi).map((f) => ({
    ...f,
    extensions: f.features,
  }));
}
