import type { Chain } from "../chains/types.js";
import { getInsightEnabledChainIds } from "../chains/utils.js";

export async function assertInsightEnabled(chains: Chain[]) {
  const chainIds = await getInsightEnabledChainIds();
  const insightEnabled = chains.every((c) => chainIds.includes(c.id));

  if (!insightEnabled) {
    throw new Error(
      `Insight is not available for chains ${chains
        .filter((c) => !chainIds.includes(c.id))
        .map((c) => c.id)
        .join(", ")}`,
    );
  }
}
