"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { WalletId } from "../../../wallets/wallet-types.js";

/**
 * Props for the WalletProvider component
 * @component
 * @wallet
 */
export type WalletProviderProps = {
  id: WalletId;
};

/**
 * @internal Exported for tests only
 */
export const WalletProviderContext = /* @__PURE__ */ createContext<
  WalletProviderProps | undefined
>(undefined);

/**
 * A React context provider component that supplies Wallet-related data to its child components.
 *
 * This component serves as a wrapper around the `WalletProviderContext.Provider` and passes
 * the provided wallet data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { WalletProvider, WalletIcon, WalletName } from "thirdweb/react";
 *
 * <WalletProvider id="io.metamask">
 *   <WalletIcon />
 *   <WalletName />
 * </WalletProvider>
 * ```
 * @beta
 * @component
 * @wallet
 */
export function WalletProvider(
  props: React.PropsWithChildren<WalletProviderProps>,
) {
  return (
    <WalletProviderContext.Provider value={props}>
      {props.children}
    </WalletProviderContext.Provider>
  );
}

/**
 * @internal
 */
export function useWalletContext() {
  const ctx = useContext(WalletProviderContext);
  if (!ctx) {
    throw new Error(
      "WalletProviderContext not found. Make sure you are using WalletIcon, WalletName, etc. inside a <WalletProvider /> component",
    );
  }
  return ctx;
}
