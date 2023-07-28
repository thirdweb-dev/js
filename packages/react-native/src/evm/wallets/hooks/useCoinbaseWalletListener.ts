import { handleResponse } from "@coinbase/wallet-mobile-sdk";
import { useEffect } from "react";
import { Linking } from "react-native";

/**
 * Coinbase wallet works differently than the other wallets. It requires UniversalLinks to be set up.
 *
 * This hook sets up the UniversalLinks listener.
 */
export function useCoinbaseWalletListener(enable: boolean) {
  useEffect(() => {
    if (!enable) {
      return;
    }

    const sub = Linking.addEventListener("url", ({ url }) => {
      // @ts-expect-error - Passing a URL object to handleResponse crashes the function
      handleResponse(url);
    });
    return () => sub?.remove();
  }, [enable]);
}
