import { useConnect } from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { useCoinbaseWalletListener } from "./useCoinbaseWalletListener";

/**
 * Hook to connect to the Coinbase wallet.
 *
 * const connect = useCoinbaseWallet('org.reactjs.native.example.test15://');
 * connect();
 *
 * @param callbackURL The Universal Link used by Coinbase Wallet to return responses to your application.
 * @returns connect function to connect to the Coinbase wallet
 */
export function useCoinbaseWallet(callbackURL: string) {
  const connect = useConnect();
  useCoinbaseWalletListener();

  return useCallback(
    async (connectOptions?: { chainId?: number; callbackURL: string }) => {
      const { coinbaseWallet } = await import("../wallets/coinbase-wallet");
      // @ts-ignore
      connect(coinbaseWallet({ callbackURL: callbackURL }), connectOptions);
    },
    [connect, callbackURL],
  );
}
