import { handleResponse } from "@coinbase/wallet-mobile-sdk";
import { useEffect } from "react";
import { Linking } from "react-native";

/**
 * Coinbase wallet works differently than the other wallets. It requires UniversalLinks to be set up.
 *
 * This hook sets up the UniversalLinks listener.
 */
export function useCoinbaseWalletListener(enable: boolean, callbackURL?: URL) {
  useEffect(() => {
    if (!enable) {
      return;
    }

    const sub = Linking.addEventListener("url", async ({ url }) => {
      console.log(
        "CoinbaseWalletListener: Setting up listener for",
        callbackURL?.toString(),
        url,
      );
      // const incomingUrl = new URL(url);
      if (callbackURL && url.includes("wsegue?")) {
        try {
          // @ts-expect-error - Passing a URL object to handleResponse crashes the function
          handleResponse(url);
        } catch (error) {
          console.error("CoinbaseWallet not initialized", error);
        }
      }
    });
    return () => sub?.remove();
  }, [callbackURL, enable]);
}
