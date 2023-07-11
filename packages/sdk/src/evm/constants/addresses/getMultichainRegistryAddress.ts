const MultichainRegistry_address = "0xcdAD8FA86e18538aC207872E8ff3536501431B73"; // Polygon only

/**
 * @internal
 */
export function getMultichainRegistryAddress() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.multiChainRegistryAddress) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.multiChainRegistryAddress as string;
  } else {
    return MultichainRegistry_address;
  }
}
