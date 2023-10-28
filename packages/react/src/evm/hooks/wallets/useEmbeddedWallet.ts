import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { AuthParams } from "@thirdweb-dev/wallets";
import { useCallback } from "react";

export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();

  return useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const { embeddedWallet } = await import(
        "../../../wallet/wallets/embeddedWallet/embeddedWallet"
      );
      const wallet = create(embeddedWallet());
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
    [create, setWallet, setStatus],
  );
}
