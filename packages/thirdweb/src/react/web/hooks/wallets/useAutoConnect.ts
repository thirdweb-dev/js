import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import type { AutoConnectProps } from "../../../core/hooks/connection/types.js";
import { useAutoConnectCore } from "../../../core/hooks/wallets/useAutoConnect.js";
import { connectionManager } from "../../index.js";

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
  return useAutoConnectCore(connectionManager, nativeLocalStorage, props);
}
