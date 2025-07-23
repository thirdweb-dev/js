import { distribute } from "../extensions/tokens/__generated__/ERC20Entrypoint/write/distribute.js";
import type { ClientAndChain } from "../utils/types.js";
import { toUnits } from "../utils/units.js";
import { getDeployedEntrypointERC20 } from "./get-entrypoint-erc20.js";
import type { DistributeContent } from "./types.js";

type DistrbuteTokenParams = ClientAndChain & {
  tokenAddress: string;
  contents: DistributeContent[];
};

export async function distributeToken(options: DistrbuteTokenParams) {
  const entrypoint = await getDeployedEntrypointERC20(options);

  if (!entrypoint) {
    throw new Error(`Entrypoint not found on chain: ${options.chain.id}`);
  }

  return distribute({
    asset: options.tokenAddress,
    contents: options.contents.map((a) => {
      return { ...a, amount: toUnits(a.amount.toString(), 18) };
    }),
    contract: entrypoint,
  });
}
