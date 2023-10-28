import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
} from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { AuthParams } from "../connectors/embedded-wallet/types";

export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();

  return useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const { embeddedWallet } = await import(
        "../wallets/embedded/embedded-wallet"
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
