import { useThirdwebWallet } from "../providers/thirdweb-wallet-provider";
import invariant from "tiny-invariant";

/**
 * @returns the current active wallet instance
 */
export function useWallet() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useWallet() hook must be used within a <ThirdwebProvider/>",
  );
  return context.activeWallet;
}

/**
 *
 * @returns `supportedWallets` configured in the `<ThirdwebProvider/>`
 */
export function useWallets() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useWallets() hook must be used within a <ThirdwebProvider/>",
  );
  return context.wallets;
}

/**
 *
 * @returns a method to connect to a wallet class
 */
export function useConnect() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useConnect() hook must be used within a <ThirdwebProvider/>",
  );
  return context.connect;
}

/**
 *
 * @returns a method to disconnect from the current active wallet
 */
export function useDisconnect() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useDisconnect() hook must be used within a <ThirdwebProvider/>",
  );
  return context.disconnect;
}

/**
 *
 * @returns the connection status of the wallet
 *
 * It can be one of the following:
 * 1. `unknown` - when wallet connection status is not yet known
 * 2. `connecting` - when wallet is connecting
 * 3. `connected` - when wallet is connected
 * 4. `disconnected` - when wallet is disconnected
 *
 */
export function useConnectionStatus() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useConnectionStatus() must be used within a <ThirdwebProvider/>",
  );
  return context.connectionStatus;
}

/**
 *
 * @returns a method to create an instance of given wallet class
 */
export function useCreateWalletInstance() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useCreateWalletInstance() must be used within a <ThirdwebProvider/>",
  );
  return context.createWalletInstance;
}

/**
 *
 * @returns a method to connect the wallet to network/chain with given chainId
 */
export function useSwitchChain() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useSwitchChain() must be used within a <ThirdwebProvider/>",
  );
  return context.switchChain;
}

/**
 *
 * @returns a method to get the chainId of currently connected network/chain
 */
export function useActiveChainId() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useActiveChainId() must be used within a <ThirdwebProvider/>",
  );
  return context.activeChainId;
}

/**
 *
 * @returns the signer of the connected wallet
 */
export function useWalletSigner() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useWalletSigner() must be used within a <ThirdwebProvider/>",
  );
  return context.signer;
}
