import type { SharedDeployOptions } from "./types.js";
import type { FullPublishMetadata } from "./utils/deploy-metadata.js";

/**
 * @internal
 */
export async function prepareDeployTransactionViaAutoFactory(
  args: SharedDeployOptions & {
    extendedMetadata: FullPublishMetadata;
  },
) {
  // TODO
  console.log(args);
}
