import { Feature } from "../../constants/contract-features";
import { DetectableFeature } from "../../core/interfaces/DetectableFeature";
import { ExtensionNotImplementedError } from "../error";

/**
 * Checks whether the given DetectableFeature is defined
 * @internal
 * @param namespace - The namespace to check
 * @param feature - The corresponding feature
 */
export function assertEnabled<T extends DetectableFeature>(
  namespace: T | undefined,
  feature: Feature,
) {
  if (!namespace) {
    throw new ExtensionNotImplementedError(feature);
  }
  return namespace as T;
}
