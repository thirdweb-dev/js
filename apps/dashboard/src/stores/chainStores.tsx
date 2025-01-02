"use client";

import { createStore } from "@/lib/reactive";
import type { ChainMetadata } from "thirdweb/chains";
import { SyncStoreToCookies } from "./SyncStoreToCookies";
import {
  TW_LOCAL_CHAIN_STORE,
  TW_RECENTLY_USED_CHAIN_IDS,
} from "./storageKeys";

export interface StoredChain extends ChainMetadata {
  // any of the name, logo, rpc etc is modified, testnet or not
  // user can not change chainId, symbol, slug
  isModified?: boolean;

  // if this chain (id) is not in our db, user added it
  isCustom?: boolean;
}

const isChainOverridesLoadedStore = createStore(false);
export const chainOverridesStore = createStore<StoredChain[]>([]);
export const recentlyUsedChainIdsStore = createStore<number[]>([]);

export function SyncChainStores() {
  return (
    <>
      <SyncStoreToCookies
        storageKey={TW_LOCAL_CHAIN_STORE}
        store={chainOverridesStore}
        onLoaded={() => {
          isChainOverridesLoadedStore.setValue(true);
        }}
      />

      <SyncStoreToCookies
        storageKey={TW_RECENTLY_USED_CHAIN_IDS}
        store={recentlyUsedChainIdsStore}
      />
    </>
  );
}

export function addRecentlyUsedChainId(chainId: number) {
  const newRecentlyUsedChains = recentlyUsedChainIdsStore
    .getValue()
    .filter((c) => c !== chainId);

  // add to the front of the array
  newRecentlyUsedChains.unshift(chainId);
  // only keep the first 5
  newRecentlyUsedChains.splice(5);

  recentlyUsedChainIdsStore.setValue(newRecentlyUsedChains);
}

export function addChainOverrides(newChain: StoredChain) {
  const currentChains = chainOverridesStore.getValue();
  const index = currentChains.findIndex((c) => c.chainId === newChain.chainId);

  let newChains: StoredChain[];

  // if this chain is already in the chains, update it in array
  if (index !== -1) {
    newChains = [...currentChains];
    newChains[index] = newChain;
  }

  // else append it
  else {
    newChains = [...currentChains, newChain];
  }

  chainOverridesStore.setValue(newChains);
}

export function removeChainOverrides(id: number) {
  chainOverridesStore.setValue(
    chainOverridesStore.getValue().filter((c) => c.chainId !== id),
  );
}
