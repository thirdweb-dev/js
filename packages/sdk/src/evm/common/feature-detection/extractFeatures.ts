import { FeatureWithEnabled } from "../../constants/contract-features";

/**
 * @internal
 */
export function extractFeatures(
  input: Record<string, FeatureWithEnabled>,
  enabledExtensions: FeatureWithEnabled[],
) {
  if (!input) {
    return;
  }
  for (const extensionKey in input) {
    const extension = input[extensionKey];
    // if extension is enabled, then add it to enabledFeatures
    if (extension.enabled) {
      enabledExtensions.push(extension);
    }
    // recurse
    extractFeatures(extension.features, enabledExtensions);
  }
}
