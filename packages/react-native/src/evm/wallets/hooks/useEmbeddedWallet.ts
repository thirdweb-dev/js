import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { AuthParams } from "../connectors/embedded-wallet/types";
import { walletIds } from "@thirdweb-dev/wallets";
import { EmbeddedWallet } from "../wallets/embedded/EmbeddedWallet";
import { embeddedWallet } from "../wallets/embedded/embedded-wallet";

/**
 * Hook to authenticate and connect to an embedded wallet
 * @returns a function to connect to an embedded wallet
 */
export function useEmbeddedWallet() {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const context = useWalletContext();
  const wallets = useWallets();

  const connect = useCallback(
    async (authParams: AuthParams) => {
      setStatus("connecting");
      const config = wallets.find((w) => w.id === walletIds.embeddedWallet);
      if (
        !config ||
        (config.personalWallets && config.personalWallets.length > 0)
      ) {
        console.warn(
          "Embedded wallet not configured in ThirdwebProvider.supportedWallets - add it to enable autoconnect on page load",
        );
      }
      const wallet = create(embeddedWallet());
      try {
        const authResult = await wallet.authenticate(authParams);
        await wallet.connect({ authResult });
        setWallet(wallet);
        setStatus("connected");
      } catch (e) {
        console.error("Error connecting to embedded wallet", e);
        setStatus("disconnected");
      }
      return wallet;
    },
    [setStatus, wallets, create, setWallet],
  );

  const sendVerificationEmail = useCallback(
    async ({ email }: { email: string }) => {
      const clientId = context.clientId;
      if (!clientId) {
        throw new Error(
          "clientId not found, please add it to ThirdwebProvider",
        );
      }
      return EmbeddedWallet.sendVerificationEmail({
        email,
        clientId,
      });
    },
    [context],
  );

  return {
    connect,
    sendVerificationEmail,
  };
}
