import { Chain } from "@thirdweb-dev/chains";
import {
  StoredChain,
  SupportedChainsContext,
} from "contexts/configured-chains";
import { useContext, useMemo } from "react";
import invariant from "tiny-invariant";

/**
 * @returns a list of all the chains that are configured
 */
export function useSupportedChains() {
  const chains = useContext(SupportedChainsContext);

  invariant(
    chains,
    "useSupportedChains must be used within a SupportedChainsContext",
  );
  return chains;
}

// maps chainId to Chain
type ConfiguredChainRecord = Record<number, StoredChain>;

/**
 * @returns a list of record that maps configured chainId to `Chain` object
 */
export function useSupportedChainsRecord() {
  const chains = useSupportedChains();
  return useMemo(() => {
    const record: ConfiguredChainRecord = {};
    chains.forEach((network) => {
      record[network.chainId] = network;
    });

    return record;
  }, [chains]);
}

/**
 * @returns a list of record that maps configured chainId to `Chain` object
 */
export function useSupportedChainsNameRecord() {
  const chains = useSupportedChains();
  return useMemo(() => {
    const record: Record<string, StoredChain | undefined> = {};
    chains.forEach((network) => {
      record[network.name] = network;
    });

    return record;
  }, [chains]);
}

/**
 * @returns a list of record that maps configured chainSlug to `Chain` object
 */
export function useSupportedChainsSlugRecord() {
  const chains = useSupportedChains();
  return useMemo(() => {
    const record: Record<string, Chain> = {};
    chains.forEach((network) => {
      record[network.slug] = network;
    });

    return record;
  }, [chains]);
}

/**
 * @returns `Chain` object for the given chainId if it is configured, otherwise `undefined`
 */
export function useSupportedChain(chainId: number) {
  const record = useSupportedChainsRecord();
  if (chainId in record) {
    return record[chainId];
  }
}
