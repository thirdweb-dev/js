import { Chain, defaultChains } from "@thirdweb-dev/chains";
import React, { createContext, useEffect, useMemo, useState } from "react";

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

/**
 * if no networks are configured by the user, return the defaultChains
 */
export function ConfiguredChainsProvider(props: { children: React.ReactNode }) {
  const [configuredNetworks, setConfiguredNetworks] = useState<StoredChain[]>(
    () => {
      if (typeof window === "undefined") {
        return defaultChains;
      }

      // todo - use indexedDb instead of localStorage
      const listFromCookies = configuredChainsStorage.get();

      if (listFromCookies.length === 0) {
        return defaultChains;
      }

      return listFromCookies;
    },
  );

  // update storage when configuredNetworks changes
  useEffect(() => {
    configuredChainsStorage.set(configuredNetworks);
  }, [configuredNetworks]);

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
    localStorage.setItem(configuredChainsStorage.key, value);
  },
};
