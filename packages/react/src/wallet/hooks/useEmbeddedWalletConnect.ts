import {
  WalletConfig,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { AuthParams, EmbeddedWallet } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

/**
 *
 * @returns `true` if the wallet does not have a UI and can sign transactions without user interaction.
 */
export function useEmbeddedWalletConnect(config: WalletConfig<EmbeddedWallet>) {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();

  return useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const wallet = create(config);
      try {
        const authResult = await wallet.authenticate(authParams);
        await wallet.connect({ authResult });
        setWallet(wallet, { authResult });
      } catch (e) {
        console.error("Error connecting to embedded wallet", e);
        setStatus("disconnected");
      }
      setStatus("connected");
      return await wallet.getAddress();
    },
    [config, create, setWallet, setStatus],
  );
}
