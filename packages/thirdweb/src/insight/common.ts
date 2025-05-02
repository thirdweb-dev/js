import type { Chain } from "../chains/types.js";
import { getChainServices } from "../chains/utils.js";

export async function assertInsightEnabled(chains: Chain[]) {
  const chainData = await Promise.all(
    chains.map((chain) =>
      isInsightEnabled(chain).then((enabled) => ({
        chain,
        enabled,
      })),
    ),
  );

  const insightEnabled = chainData.every((c) => c.enabled);

  if (!insightEnabled) {
    throw new Error(
      `Insight is not available for chains ${chainData
        .filter((c) => !c.enabled)
        .map((c) => c.chain.id)
        .join(", ")}`,
    );
  }
}

export async function isInsightEnabled(chain: Chain) {
  const chainData = await getChainServices(chain);
  return chainData.some((c) => c.service === "insight" && c.enabled);
}
