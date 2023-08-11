import { getProcessEnv } from "../../../core/utils/process";

const MultichainRegistry_address = "0xcdAD8FA86e18538aC207872E8ff3536501431B73"; // Polygon only

/**
 * @internal
 */
export function getMultichainRegistryAddress() {
  return getProcessEnv("multiChainRegistryAddress", MultichainRegistry_address);
}
