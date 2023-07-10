import { WalletConnectConnector } from "../wallet-connect";

/**
 * @deprecated Use `WalletConnectConnector` instead
 *
 * The WalletConnect v1.0 protocol has been shut down and no longer works.
 * To avoid breaking change, `WalletConnectV1Connector` is still available but is an alias of `WalletConnectConnector`.
 */
export const WalletConnectV1Connector = WalletConnectConnector;
