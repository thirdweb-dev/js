import { Chain, defaultChains } from "@thirdweb-dev/chains";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// extra information on top of Chain interface
// all keys added here must be optional
export interface StoredChain extends Chain {
  /**
   * true if the chain is added by user using the "custom" option
   */
  isCustom?: true;

  /**
   * true if the chain is auto configured and not explicitly configured by user
   */
  isAutoConfigured?: true;
}

type UpdateConfiguredChains = {
  add: (newConfiguredNetworks: StoredChain[]) => void;
  remove: (index: number) => void;
  update: (index: number, chain: StoredChain) => void;
};

export const ConfiguredChainsContext = createContext<StoredChain[] | undefined>(
  undefined,
);

export const UpdateConfiguredChainsContext = createContext<
  UpdateConfiguredChains | undefined
>(undefined);

// util to unique chains by chainId
export function uniqueChains(chains: StoredChain[]): StoredChain[] {
  const chainsRecord: Record<number, StoredChain> = {};
  chains.forEach((chain) => {
    chainsRecord[chain.chainId] = chain;
  });
  return Object.values(chainsRecord);
}

/**
 * if no networks are configured by the user, return the defaultChains
 */
export function ConfiguredChainsProvider(props: { children: React.ReactNode }) {
  const [configuredNetworks, _setConfiguredNetworks] =
    useState<StoredChain[]>(defaultChains);

  // this proxies the setstate function to also update the localstorage under the hood
  const setConfiguredNetworks: React.Dispatch<
    React.SetStateAction<StoredChain[]>
  > = useCallback((updater) => {
    _setConfiguredNetworks((prev) => {
      if (typeof updater === "function") {
        const newConfiguredNetworks = uniqueChains(updater(prev));
        configuredChainsStorage.set(newConfiguredNetworks);
        return newConfiguredNetworks;
      } else {
        const newChains = uniqueChains(updater);
        configuredChainsStorage.set(newChains);
        return newChains;
      }
    });
  }, []);

  // set the configured networks initially
  // has to happen in useEffect because otherwise we mismatch with server state potentially
  useEffect(() => {
    // todo - use indexedDb instead of localStorage
    const listFromCookies = uniqueChains(configuredChainsStorage.get());
    if (listFromCookies.length > 0) {
      _setConfiguredNetworks(listFromCookies);
    }
  }, []);

  const updator: UpdateConfiguredChains = useMemo(() => {
    return {
      add(newNetworks: StoredChain[]) {
        setConfiguredNetworks((prev) => [...prev, ...newNetworks]);
      },
      remove(index: number) {
        setConfiguredNetworks((prev) => {
          const newConfiguredNetworks = [...prev];
          newConfiguredNetworks.splice(index, 1);
          return newConfiguredNetworks;
        });
      },
      update(index: number, newNetwork: StoredChain) {
        setConfiguredNetworks((prev) => {
          const newConfiguredNetworks = [...prev];
          newConfiguredNetworks[index] = newNetwork;
          return newConfiguredNetworks;
        });
      },
    };
  }, [setConfiguredNetworks]);

  return (
    <ConfiguredChainsContext.Provider value={configuredNetworks}>
      <UpdateConfiguredChainsContext.Provider value={updator}>
        {props.children}
      </UpdateConfiguredChainsContext.Provider>
    </ConfiguredChainsContext.Provider>
  );
}

// storage  --------------------------------------------
// currently using localStorage, but will move to indexedDb shortly

const configuredChainsStorage = {
  key: "configured-chains",
  get(): StoredChain[] {
    try {
      const networkListStr = localStorage.getItem(configuredChainsStorage.key);
      return networkListStr ? JSON.parse(networkListStr) : [];
    } catch (e) {
      // if parsing error, clear dirty storage
      localStorage.removeItem(configuredChainsStorage.key);
    }

    return [];
  },

  set(networkList: StoredChain[]) {
    const value = JSON.stringify(networkList);
    try {
      localStorage.setItem(configuredChainsStorage.key, value);
    } catch (e) {
      // if storage limit exceed
      // clear entire local storage and then try again
      localStorage.clear();
      localStorage.setItem(configuredChainsStorage.key, value);
    }
  },
};
