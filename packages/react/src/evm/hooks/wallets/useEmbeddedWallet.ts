import {
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWallet,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import {
  walletIds,
  type AuthParams,
  EmbeddedWallet,
} from "@thirdweb-dev/wallets";
import { useCallback, useEffect } from "react";
import { embeddedWallet } from "../../../wallet/wallets/embeddedWallet/embeddedWallet";
import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
        throw e;
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

export function useEmbeddedWalletUserEmail(): UseQueryResult<
  string | undefined
> {
  const wallet = useWallet();
  const queryClient = useQueryClient();

  const emailQuery = useQuery<string | undefined, string>(
    [wallet?.walletId, "embeddedWallet-email"],
    () => {
      if (wallet && wallet.walletId === walletIds.embeddedWallet) {
        return (wallet as EmbeddedWallet).getEmail();
      }
    },
    {
      retry: false,
      enabled: wallet?.walletId === walletIds.embeddedWallet,
    },
  );

  // Invalidate the query when the wallet changes
  useEffect(() => {
    queryClient.invalidateQueries([wallet?.walletId, "embeddedWallet-email"]);
  }, [wallet, queryClient]);

  return emailQuery;
}
