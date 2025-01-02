"use client";

import type { Address } from "abitype";
import type React from "react";
import { createContext, useContext } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";

/**
 * Props for the <TokenProvider /> component
 * @component
 * @token
 */
export type TokenProviderProps = {
  /**
   * The token (ERC20) contract address
   */
  address: Address;
  /**
   * thirdweb Client
   */
  client: ThirdwebClient;
  /**
   * The chain (network) that the token is on
   */
  chain: Chain;
};

const TokenProviderContext = /* @__PURE__ */ createContext<
  TokenProviderProps | undefined
>(undefined);

/**
 * A React context provider component that supplies Token-related data to its child components.
 *
 * This component serves as a wrapper around the `TokenProviderContext.Provider` and passes
 * the provided token data down to all of its child components through the context API.
 *
 * @example
 * ### Basic usage
 * ```tsx
 * import { TokenProvider, TokenIcon, TokenName  } from "thirdweb/react";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider address="0x..." client={...} chain={ethereum}>
 *   <TokenIcon />
 *   <TokenName />
 * </TokenProvider>
 * ```
 *
 * ### This component also works with native token!
 * ```tsx
 * import { NATIVE_TOKEN_ADDRESS} from "thirdweb";
 * import { ethereum } from "thirdweb/chains";
 *
 * <TokenProvider address={NATIVE_TOKEN_ADDRESS} chain={ethereum} client={client}>
 *   <TokenSymbol /> // "ETH"
 * </TokenProvider>
 * ```
 *
 * @component
 * @token
 * @beta
 */
export function TokenProvider(
  props: React.PropsWithChildren<TokenProviderProps>,
) {
  return (
    <TokenProviderContext.Provider value={props}>
      {props.children}
    </TokenProviderContext.Provider>
  );
}

/**
 * @internal
 */
export function useTokenContext() {
  const ctx = useContext(TokenProviderContext);
  if (!ctx) {
    throw new Error(
      "TokenProviderContext not found. Make sure you are using TokenName, TokenIcon, TokenSymbol etc. inside a <TokenProvider /> component",
    );
  }
  return ctx;
}
