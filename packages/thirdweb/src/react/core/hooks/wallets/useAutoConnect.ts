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
    accountAbstraction: props.accountAbstraction,
    client: props.client,
  });

  // trigger the auto connect on first mount only
  const query = useQuery({
    queryFn: () =>
      autoConnectCore({
        connectOverride: connect,
        createWalletFn,
        getInstalledWallets,
        manager,
        props,
        setLastAuthProvider,
        storage,
      }),
    queryKey: ["autoConnect", props.client.clientId],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
