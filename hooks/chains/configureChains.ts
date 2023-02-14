import { Chain } from "@thirdweb-dev/chains";
import {
  ConfiguredChainsContext,
  StoredChain,
  UpdateConfiguredChainsContext,
} from "contexts/configured-chains";
import { useContext, useMemo } from "react";
import invariant from "tiny-invariant";

/**
 * @returns a list of all the chains that are configured
 */
export function useConfiguredChains() {
  const chains = useContext(ConfiguredChainsContext);

  invariant(
    chains,
    "useConfiguredChains must be used within a ConfiguredNetworksProvider",
  );
  return chains;
}

/**
 * @returns an object with methods to update the configured chains - `add`, `remove`, `update`
 */
export function useUpdateConfiguredChains() {
  const methods = useContext(UpdateConfiguredChainsContext);
  invariant(
    methods,
    "useUpdateConfiguredChains must be used within a ConfiguredNetworksProvider",
  );
  return methods;
}

// maps chainId to Chain
export type ConfiguredChainRecord = Record<number, StoredChain>;

/**
 * @returns a list of record that maps configured chainId to `Chain` object
 */
export function useConfiguredChainsRecord() {
  const configuredNetworks = useConfiguredChains();
  return useMemo(() => {
    const record: ConfiguredChainRecord = {};
    configuredNetworks.forEach((network) => {
      record[network.chainId] = network;
    });

    return record;
  }, [configuredNetworks]);
}

/**
 * @returns a list of record that maps configured chainId to `Chain` object
 */
export function useConfiguredChainsNameRecord() {
  const configuredNetworks = useConfiguredChains();
  return useMemo(() => {
    const record: Record<string, StoredChain | undefined> = {};
    configuredNetworks.forEach((network) => {
      record[network.name] = network;
    });

    return record;
  }, [configuredNetworks]);
}

/**
 * @returns a list of record that maps configured chainSlug to `Chain` object
 */
export function useConfiguredChainSlugRecord() {
  const configuredNetworks = useConfiguredChains();
  return useMemo(() => {
    const record: Record<string, Chain> = {};
    configuredNetworks.forEach((network) => {
      record[network.slug] = network;
    });

    return record;
  }, [configuredNetworks]);
}

/**
 * @returns `Chain` object for the given chainId if it is configured, otherwise `undefined`
 */
export function useConfiguredChain(chainId: number) {
  const record = useConfiguredChainsRecord();
  if (chainId in record) {
    return record[chainId];
  }
}
