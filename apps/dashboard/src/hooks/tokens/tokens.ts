import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Address } from "thirdweb";
import {
  type TokenMetadata,
  getUniversalBridgeTokens,
} from "../../@/api/universal-bridge/tokens";
import { createStore, useStore } from "../../@/lib/reactive";

type StructuredTokensStore = {
  allTokens: TokenMetadata[];
  nameToToken: Map<string, TokenMetadata[] | undefined>;
  symbolToTokens: Map<string, TokenMetadata[] | undefined>;
  chainToTokens: Map<number, TokenMetadata[] | undefined>;
  addressToToken: Map<string, TokenMetadata | undefined>;
  addressChainToToken: Map<string, TokenMetadata | undefined>;
};

function createStructuredTokensStore() {
  const store = createStore<StructuredTokensStore>({
    allTokens: [],
    nameToToken: new Map(),
    symbolToTokens: new Map(),
    chainToTokens: new Map(),
    addressToToken: new Map(),
    addressChainToToken: new Map(),
  });

  const dependencies = [tokensStore];
  for (const dep of dependencies) {
    dep.subscribe(() => {
      updateStructuredTokensStore(tokensStore.getValue());
    });
  }

  function updateStructuredTokensStore(tokens: TokenMetadata[]) {
    // if original tokens are not loaded yet - ignore
    if (tokens.length === 0) {
      return;
    }

    const allTokens: TokenMetadata[] = [];
    const nameToToken: Map<string, TokenMetadata[] | undefined> = new Map();
    const symbolToTokens: Map<string, TokenMetadata[] | undefined> = new Map();
    const chainToTokens: Map<number, TokenMetadata[] | undefined> = new Map();
    const addressToTokens: Map<Address, TokenMetadata | undefined> = new Map();
    const addressChainToToken: Map<string, TokenMetadata | undefined> =
      new Map();

    for (const token of tokens) {
      allTokens.push(token);
      nameToToken.set(token.name, [
        ...(nameToToken.get(token.name) || []),
        token,
      ]);
      symbolToTokens.set(token.symbol, [
        ...(symbolToTokens.get(token.symbol) || []),
        token,
      ]);
      chainToTokens.set(token.chainId, [
        ...(chainToTokens.get(token.chainId) || []),
        token,
      ]);
      addressToTokens.set(token.address as Address, token);
      addressChainToToken.set(`${token.chainId}:${token.address}`, token);
    }

    store.setValue({
      allTokens,
      nameToToken,
      symbolToTokens,
      chainToTokens,
      addressToToken: addressToTokens,
      addressChainToToken: addressChainToToken,
    });
  }

  return store;
}

const tokensStore = /* @__PURE__ */ createStore<TokenMetadata[]>([]);
const structuredTokensStore = /* @__PURE__ */ createStructuredTokensStore();

export function useTokensData({
  chainId,
  enabled,
}: { chainId?: number; enabled?: boolean }) {
  const tokensQuery = useQuery({
    queryKey: ["universal-bridge-tokens", chainId],
    queryFn: () => getUniversalBridgeTokens({ chainId }),
    enabled,
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!tokensQuery.data) {
      return;
    }

    tokensStore.setValue(tokensQuery.data);
  }, [tokensQuery.data]);

  return {
    tokens: useStore(structuredTokensStore),
    isLoading: tokensQuery.isLoading,
    isFetching: tokensQuery.isFetching,
  };
}
