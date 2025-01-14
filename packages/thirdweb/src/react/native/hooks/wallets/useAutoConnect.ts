import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import type { AutoConnectProps } from "../../../../wallets/connection/types.js";
import { createWallet } from "../../../../wallets/native/create-wallet.js";
import { useAutoConnectCore } from "../../../core/hooks/wallets/useAutoConnect.js";
import { getDefaultWallets } from "../../wallets/defaultWallets.js";

/**
 * Autoconnect the last previously connected wallet.
 *
 * @example
 * ```tsx
 * import { useAutoConnect } from "thirdweb/react";
 *
 * const { data: autoConnected, isLoading } = useAutoConnect({
 *  client,
 *  accountAbstraction,
 *  wallets,
 *  onConnect,
 *  timeout,
 * });
 * ```
 * @walletConnection
 * @param props - The props for auto connect.
 * @returns whether the auto connect was successful.
 */
export function useAutoConnect(props: AutoConnectProps) {
  return useAutoConnectCore(
    nativeLocalStorage,
    {
      ...props,
      wallets: props.wallets || getDefaultWallets(props),
    },
    createWallet,
  );
}
