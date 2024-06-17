"use client";
import { useEffect } from "react";
import type { AutoConnectProps } from "../../../core/hooks/connection/types.js";
import { useAutoConnect } from "../../hooks/wallets/useAutoConnect.js";
import { useSetActiveWalletConnectionStatus } from "../../hooks/wallets/useSetActiveWalletConnectionStatus.js";

/**
 * AutoConnect last connected wallet on page reload or revisit.
 * Note: If you are using `ConnectButton` or `ConnectEmbed` components, You don't need to use this component as it is already included.
 *
 * This is useful if you are manually connecting the wallets using the [`useConnect`](https://portal.thirdweb.com/references/typescript/v5/useConnect) hook and want to auto connect the last connected wallets on page reload or revisit.
 * @param props - Object of type `AutoConnectProps`. Refer to [`AutoConnectProps`](https://portal.thirdweb.com/references/typescript/v5/AutoConnectProps)
 * @example
 * ```tsx
 * import { AutoConnect } from "thirdweb/react";
 * import { createWallet, inAppWallet } from "thirdweb/wallets";
 *
 *
 * // list of wallets that your app uses
 * const wallets = [
 *  inAppWallet(),
 *  createWallet('io.metamask'),
 *  createWallet("me.rainbow"),
 * ]
 *
 * function Example() {
 *  return (
 *    <AutoConnect
 *      wallets={wallets}
 *      client={client}
 *      appMetadata={appMetadata}
 *    />
 *  );
 * }
 * ```
 * @component
 */
export function AutoConnect(props: AutoConnectProps) {
  useAutoConnect(props);
  return <></>;
}

let noAutoConnectDone = false;

/**
 * @internal
 */
export function NoAutoConnect() {
  const setConnectionStatus = useSetActiveWalletConnectionStatus();
  useEffect(() => {
    if (noAutoConnectDone) {
      return;
    }
    noAutoConnectDone = true;
    setConnectionStatus("disconnected");
  });

  return null;
}
