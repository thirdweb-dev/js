import { ZERO_ADDRESS } from "../constants/addresses.js";
import { getRouter } from "../extensions/assets/__generated__/ERC20AssetEntrypoint/read/getRouter.js";
import type { ClientAndChain } from "../utils/types.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";

export async function isRouterEnabled(
  options: ClientAndChain,
): Promise<boolean> {
  const entrypoint = await getDeployedEntrypointERC20(options);

  if (!entrypoint) {
    return false;
  }

  const router = await getRouter({
    contract: entrypoint,
  });

  return router !== ZERO_ADDRESS;
}
