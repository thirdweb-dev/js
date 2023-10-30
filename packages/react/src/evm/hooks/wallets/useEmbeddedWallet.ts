import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  walletIds,
  type AuthParams,
  type EmbeddedWallet,
} from "@thirdweb-dev/wallets";
import { useCallback } from "react";

export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const wallets = useWallets();

  return useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const config = wallets.find((w) => w.id === walletIds.embeddedWallet);
      if (!config) {
        throw new Error(
          "Embedded wallet not configured, please add it to ThirdwebProvider.supportedWallets",
        );
      }
      const wallet = create(config) as EmbeddedWallet;
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
    [create, setWallet, setStatus, wallets],
  );
}
