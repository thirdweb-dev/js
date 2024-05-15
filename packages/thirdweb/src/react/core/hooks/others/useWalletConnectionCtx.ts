import { useContext } from "react";
import { ConnectUIContext } from "../../providers/wallet-connection.js";

/**
 * @internal
 */
export function useConnectUI() {
  const val = useContext(ConnectUIContext);
  if (!val) {
    throw new Error(
      "useConnectUI must be used within a <ConnectButton /> or <ConnectEmbed />",
    );
  }
  return val;
}
