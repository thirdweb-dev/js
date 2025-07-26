import { ZERO_ADDRESS } from "../constants/addresses.js";
import { getContract } from "../contract/contract.js";
import { getPoolRouter } from "../extensions/tokens/__generated__/ERC20Entrypoint/read/getPoolRouter.js";
import { getAdapter } from "../extensions/tokens/__generated__/PoolRouter/read/getAdapter.js";
import type { ClientAndChain } from "../utils/types.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";

export async function isPoolRouterEnabled(
  options: ClientAndChain,
): Promise<boolean> {
  const entrypoint = await getDeployedEntrypointERC20(options);
  if (!entrypoint) {
    return false;
  }

  const poolRouterAddress = await getPoolRouter({
    contract: entrypoint,
  });
  if (poolRouterAddress === ZERO_ADDRESS) {
    return false;
  }

  const poolRouterContract = getContract({
    address: poolRouterAddress,
    chain: options.chain,
    client: options.client,
  });

  const [v3Adapter, v4Adapter] = await Promise.all([
    getAdapter({
      contract: poolRouterContract,
      adapterType: 1,
    }),
    getAdapter({
      contract: poolRouterContract,
      adapterType: 2,
    }),
  ]);

  if (
    v3Adapter.rewardLocker === ZERO_ADDRESS &&
    v4Adapter.rewardLocker === ZERO_ADDRESS
  ) {
    return false;
  }

  return true;
}
