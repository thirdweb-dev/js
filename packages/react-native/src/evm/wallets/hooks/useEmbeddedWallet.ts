import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { AuthParams } from "../connectors/embedded-wallet/types";
import { type EmbeddedWallet, walletIds } from "@thirdweb-dev/wallets";

/**
 * Hook to authenticate and connect to an embedded wallet
 * @returns a function to connect to an embedded wallet
 */
export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const wallets = useWallets();

  return useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      let isPersonalWallet = false;
      let config = wallets.find(
        (w) =>
          w.id === walletIds.embeddedWallet ||
          w.personalWallets
            ?.map((p) => p.id)
            .includes(walletIds.embeddedWallet),
      );
      // if config is set to smart wallet with embedded wallet as personal wallet, find the embedded wallet config
      if (config?.personalWallets) {
        config = config.personalWallets.find(
          (w) => w.id === walletIds.embeddedWallet,
        );
        isPersonalWallet = !!config;
      }
      if (!config) {
        throw new Error(
          "Embedded wallet not configured, please add it to ThirdwebProvider.supportedWallets",
        );
      }
      const wallet = create(config) as EmbeddedWallet;
      try {
        const authResult = await wallet.authenticate(authParams);
        await wallet.connect({ authResult });
        // only set the connected wallet if its the main wallet, otherwise let the main wallet handle it
        if (!isPersonalWallet) {
          setWallet(wallet, { authResult });
          setStatus("connected");
        }
      } catch (e) {
        console.error("Error connecting to embedded wallet", e);
        setStatus("disconnected");
      }
      return wallet;
    },
    [create, setWallet, setStatus, wallets],
  );
}
