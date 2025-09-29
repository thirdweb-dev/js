import type { Chain } from "thirdweb";
import { defineChain } from "thirdweb";

type EcosystemIdentifier = `ecosystem.${string}` | string | undefined;

const SPECIAL_ECOSYSTEM_CHAIN_IDS: Record<string, readonly number[]> = {
  "mon-id": [1, 43114] as const,
};

function normalizeEcosystemSlug(ecosystem?: string) {
  if (!ecosystem) {
    return undefined;
  }
  if (ecosystem.startsWith("ecosystem.")) {
    const [, slug] = ecosystem.split(".");
    return slug;
  }
  return ecosystem;
}

export function getEcosystemChainIds(
  ecosystem?: EcosystemIdentifier,
): number[] | undefined {
  const slug = normalizeEcosystemSlug(ecosystem);
  const chainIds = slug ? SPECIAL_ECOSYSTEM_CHAIN_IDS[slug] : undefined;
  return chainIds ? [...chainIds] : undefined;
}

export function getEcosystemChains(
  ecosystem?: EcosystemIdentifier,
): Chain[] | undefined {
  const chainIds = getEcosystemChainIds(ecosystem);
  return chainIds?.map((chainId) => defineChain(chainId));
}
