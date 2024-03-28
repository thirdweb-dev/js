import { useContext } from "react";
import { WalletConnectionContext } from "../../providers/wallet-connection.js";

/**
 * @internal
 */
export function useWalletConnectionCtx() {
  const val = useContext(WalletConnectionContext);
  if (!val) {
    throw new Error(
      "useWalletConnectionCtx must be used within a <ConnectWallet /> or <AutoConnect /> component.",
    );
  }
  return val;
}
