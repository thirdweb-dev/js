import {
  ExtensionWithEnabled,
  FeatureWithEnabled,
} from "../../constants/contract-features";
import { AbiInput } from "../../schema/contracts/custom";
import { joinABIs } from "../plugin/joinABIs";
import { detectFeatures, detectFeaturesFromBytecode } from "./detectFeatures";
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
 * @internal
 */
export function getAllDetectedExtensionsFromBytecode(
  bytecode: string,
): FeatureWithEnabled[] {
  const features: FeatureWithEnabled[] = [];
  extractFeatures(detectFeaturesFromBytecode(bytecode), features);
  return features;
}

/**
 * @internal
 */
export function constructAbiFromBytecode(bytecode: string): AbiInput {
  let extensions = getAllDetectedExtensionsFromBytecode(bytecode);
  // special deduping for ERC721 and ERC20
  if (extensions.find((f) => f.name === "ERC721")) {
    extensions = extensions.filter((f) => f.name !== "ERC20");
  }
  const abi = joinABIs(extensions.map((f) => joinABIs(f.abis as any)));
  return abi;
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
