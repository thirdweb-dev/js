import { walletConnect } from "./walletConnect/walletConnect";

/**
 * @deprecated Use `walletConnect` instead
 *
 * The WalletConnect v1.0 protocol has been shut down and no longer works.
 * To avoid breaking change, `walletConnectV1` is still available but is an alias of `walletConnect`.
 *
 * @internal
 */
export const walletConnectV1 = walletConnect;
