import { getClient } from "./getClient";
import type { Provider } from "@wagmi/core";

export type GetProviderArgs = {
  /** Chain id to use for provider */
  chainId?: number;
};

export type GetProviderResult<TProvider extends Provider = Provider> =
  TProvider;

export function getProvider<TProvider extends Provider = Provider>({
  chainId,
}: GetProviderArgs = {}): GetProviderResult<TProvider> {
  const client = getClient<TProvider>();
  if (chainId) return client.getProvider({ chainId }) || client.provider;
  return client.provider;
}
