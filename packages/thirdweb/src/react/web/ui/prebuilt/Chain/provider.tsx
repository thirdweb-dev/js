"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { Chain } from "../../../../../chains/types.js";

/**
 * Props for the <ChainProvider /> component
 * @component
 * @chain
 */
export type ChainProviderProps = {
  chain: Chain;
};

const ChainProviderContext = /* @__PURE__ */ createContext<
  ChainProviderProps | undefined
>(undefined);

/**
 * A React context provider component that supplies Chain-related data to its child components.
 *
 * This component serves as a wrapper around the `ChainProviderContext.Provider` and passes
 * the provided chain data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { ChainProvider, ChainIcon, ChainName } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <ChainProvider chain={ethereum}>
 *   <ChainIcon />
 *   <ChainName />
 * </ChainProvider>
 * ```
 *
 * ### Usage with defineChain
 * ```tsx
 * import { defineChain } from "thirdweb/chains"l
 * import { ChainProvider, ChainName } from "thirdweb/react";
 *
 * const chainId = someNumber;
 *
 * <ChainProvider chain={defineChain(chainId)}>
 *   <ChainName />
 * </ChainProvider>
 * ```
 * @component
 * @chain
 * @beta
 */
export function ChainProvider(
  props: React.PropsWithChildren<ChainProviderProps>,
) {
  return (
    <ChainProviderContext.Provider value={props}>
      {props.children}
    </ChainProviderContext.Provider>
  );
}

/**
 * @internal
 */
export function useChainContext() {
  const ctx = useContext(ChainProviderContext);
  if (!ctx) {
    throw new Error(
      "ChainProviderContext not found. Make sure you are using ChainName, ChainIcon, etc. inside a <ChainProvider /> component",
    );
  }
  return ctx;
}
