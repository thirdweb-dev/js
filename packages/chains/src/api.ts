import type { ApiChain, Chain } from "./types";

const DEFAULT_API_HOST = "https://api.thirdweb.com";

type ADVANCED_OPTIONS = {
  host?: string;
  secretKey?: string;
};

export function convertApiChainToChain(apiChain: ApiChain): Chain {
  return {
    ...apiChain,
    chainId: parseInt(apiChain.chainId),
    status: apiChain.status || undefined,
    features: apiChain.features.map((feature) => ({ name: feature })),
    icon: apiChain.icon || undefined,
  };
}

export function convertChainToApiChain(chain: Chain): ApiChain {
  return {
    ...chain,
    chainId: chain.chainId.toString(),
    status: chain.status || null,
    features: chain.features?.map((feature) => feature.name) || [],
    icon: chain.icon || null,
  };
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
  sort?: "chainId" | "updatedAt" | "createdAt";
  order?: "asc" | "desc";
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
