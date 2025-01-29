"use client";

import type React from "react";
import { createContext, useContext } from "react";
import type { ThirdwebClient } from "../../../client/client.js";
/**
 * Props for the <AccountProvider /> component
 * @component
 * @wallet
 */
export type AccountProviderProps = {
  /**
   * The user's wallet address
   */
  address: string;
  /**
   * thirdweb Client
   */
  client: ThirdwebClient;
};

const AccountProviderContext = /* @__PURE__ */ createContext<
  AccountProviderProps | undefined
>(undefined);

/**
 * A React context provider component that supplies Account-related data to its child components.
 *
 * This component serves as a wrapper around the `AccountProviderContext.Provider` and passes
 * the provided account data down to all of its child components through the context API.
 *
 * @example
 * ```tsx
 * import { AccountProvider, AccountAvatar, AccountName, AccountAddress  } from "thirdweb/react";
 *
 * <AccountProvider address="0x..." client={client}>
 *   <AccountAvatar />
 *   <AccountName />
 *   <AccountAddress />
 * </AccountProvider>
 * ```
 *
 * @component
 * @wallet
 * @beta
 */
export function AccountProvider(
  props: React.PropsWithChildren<AccountProviderProps>,
) {
  if (!props.address) {
    throw new Error(
      "AccountProvider: No address passed. Ensure an address is always provided to the AccountProvider",
    );
  }
  return (
    <AccountProviderContext.Provider value={props}>
      {props.children}
    </AccountProviderContext.Provider>
  );
}

/**
 * @internal
 */
export function useAccountContext() {
  const ctx = useContext(AccountProviderContext);
  if (!ctx) {
    throw new Error(
      "AccountProviderContext not found. Make sure you are using AccountName, AccountAvatar, etc. inside an <AccountProvider /> component",
    );
  }
  return ctx;
}
