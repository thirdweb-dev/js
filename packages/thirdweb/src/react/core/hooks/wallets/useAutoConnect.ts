"use client";

import { useQuery } from "@tanstack/react-query";
import type { AsyncStorage } from "../../../../utils/storage/AsyncStorage.js";
import { autoConnectCore } from "../../../../wallets/connection/autoConnectCore.js";
import type { AutoConnectProps } from "../../../../wallets/connection/types.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { WalletId } from "../../../../wallets/wallet-types.js";
import { useConnectionManagerCtx } from "../../providers/connection-manager.js";
import { setLastAuthProvider } from "../../utils/storage.js";
import { useConnect } from "./useConnect.js";

export function useAutoConnectCore(
  storage: AsyncStorage,
  props: AutoConnectProps & { wallets: Wallet[] },
  createWalletFn: (id: WalletId) => Wallet,
  getInstalledWallets?: () => Wallet[],
) {
  const manager = useConnectionManagerCtx("useAutoConnect");
  const { connect } = useConnect({
    client: props.client,
    accountAbstraction: props.accountAbstraction,
  });

  // trigger the auto connect on first mount only
  const query = useQuery({
    queryKey: ["autoConnect", props.client.clientId],
    queryFn: () =>
      autoConnectCore({
        createWalletFn,
        manager,
        props,
        storage,
        connectOverride: connect,
        getInstalledWallets,
        setLastAuthProvider,
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
