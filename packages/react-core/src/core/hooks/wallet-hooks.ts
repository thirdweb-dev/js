import { useThirdwebWallet } from "../providers/thirdweb-wallet-provider";
import invariant from "tiny-invariant";

/**
 * @returns the current active wallet instance
 */
export function useActiveWallet() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useActiveWallet() hook must be used within a <ThirdwebProvider/>",
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
 * @returns ID of the wallet that is currently being connected,
 *
 * `undefined` if :
 * * no wallet is being connected
 * * or a wallet is already connected
 * * or no wallet is connected
 */
export function useConnectingToWallet() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useConnectingToWallet() must be used within a <ThirdwebProvider/>",
  );
  return context.connectingToWallet;
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
 * @returns the account address of the connected wallet
 */
export function useAccountAddress() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useAccountAddress() must be used within a <ThirdwebProvider/>",
  );
  return context.accountAddress;
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

/**
 *
 * @returns the display uri from wallet connect. Usually used in mobile environments
 */
export function useDisplayUri() {
  const context = useThirdwebWallet();
  invariant(
    context,
    "useDisplayUri() must be used within a <ThirdwebProvider/>",
  );
  return context.displayUri;
}
