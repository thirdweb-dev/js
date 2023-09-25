import type { ApiChain, Chain } from "./types";

const DEFAULT_API_HOST = "https://api.thirdweb.com";

type ADVANCED_OPTIONS = {
  host?: string;
  secretKey?: string;
};

function omitEmptyKeys<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined),
  ) as T;
}

export function convertApiChainToChain(apiChain: ApiChain): Chain {
  return omitEmptyKeys({
    ...apiChain,
    chainId: parseInt(apiChain.chainId),
    status: apiChain.status || undefined,
    features: apiChain.features.map((feature) => ({ name: feature })),
    icon: apiChain.icon || undefined,
    infoURL: apiChain.infoURL || undefined,
  });
}

export function convertChainToApiChain(chain: Chain): ApiChain {
  return omitEmptyKeys({
    ...chain,
    chainId: chain.chainId.toString(),
    status: chain.status || null,
    features: chain.features?.map((feature) => feature.name) || [],
    icon: chain.icon || null,
    infoURL: chain.infoURL || null,
  });
}

export async function getChainFromApi(
  chainIdOrSlug: number | string,
  advancedOptions: ADVANCED_OPTIONS = {},
) {
  const options = { host: DEFAULT_API_HOST, ...advancedOptions };
  const url = new URL(`${options.host}`);
  url.pathname = "/v1/chain";

  if (typeof chainIdOrSlug === "string") {
    url.searchParams.set("slug", chainIdOrSlug);
  } else {
    url.searchParams.set("chainId", chainIdOrSlug.toString());
  }
  const response = await fetch(url);

  const json = await response.json();

  if (json.error !== null) {
    return json;
  }

  return { ...json, data: convertApiChainToChain(json.data) };
}

type ChainListQuery = {
  limit?: number;
  page?: number;
  sortBy?: "chainId" | "updatedAt" | "createdAt";
  sort?: "asc" | "desc";
  filter?: "mainnet" | "testnet";
};

export async function getChainList(
  queryParams: ChainListQuery = {},
  advancedOptions: ADVANCED_OPTIONS = {},
) {
  const options = { host: DEFAULT_API_HOST, ...advancedOptions };
  const url = new URL(`${options.host}/v1/chains`);
  if (queryParams) {
    for (const key in queryParams) {
      const value = queryParams[key as keyof typeof queryParams];
      if (key && value) {
        url.searchParams.set(key, value.toString());
      }
    }
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch chains`);
  }
  const json = await response.json();

  if (json.error !== null) {
    return json;
  }

  return {
    ...json,
    data: json.data.map(convertApiChainToChain),
  };
}

type ChainCreateOptions = ADVANCED_OPTIONS & {
  secretKey: string;
  type?: "public" | "private";
};

export async function createChain(
  chain: Chain,
  advancedOptions: ChainCreateOptions,
) {
  const options = {
    host: DEFAULT_API_HOST,
    type: "public",
    ...advancedOptions,
  };
  const url = new URL(`${options.host}/v1/chains/create`);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": options.secretKey,
    },
    body: JSON.stringify({
      chain: convertChainToApiChain(chain),
      type: options.type,
    }),
  });
  const json = await response.json();

  if (json.error !== null) {
    return json;
  }

  return json;
}
