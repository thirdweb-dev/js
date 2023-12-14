import { useWalletContext } from "../providers/thirdweb-wallet-provider";
import invariant from "tiny-invariant";
import type {
  BloctoWallet,
  Coin98Wallet,
  CoinbaseWallet,
  CoreWallet,
  CryptoDefiWallet,
  EmbeddedWallet,
  FrameWallet,
  LocalWallet,
  MagicLink,
  MetaMaskWallet,
  OKXWallet,
  OneKeyWallet,
  PaperWallet,
  PhantomWallet,
  RabbyWallet,
  RainbowWallet,
  SafeWallet,
  SmartWallet,
  TokenBoundSmartWallet,
  TrustWallet,
  WalletConnect,
  walletIds,
} from "@thirdweb-dev/wallets";
import { WalletInstance } from "../types/wallet";

export type WalletId = (typeof walletIds)[keyof typeof walletIds];

type WalletIdToWalletTypeMap = {
  metamask: MetaMaskWallet;
  coin98: Coin98Wallet;
  coinbase: CoinbaseWallet;
  coreWallet: CoreWallet;
  rainbowWallet: RainbowWallet;
  blocto: BloctoWallet;
  frame: FrameWallet;
  localWallet: LocalWallet;
  magicLink: MagicLink;
  paper: PaperWallet;
  smartWallet: SmartWallet;
  tokenBoundSmartWallet: TokenBoundSmartWallet;
  safe: SafeWallet;
  trust: TrustWallet;
  embeddedWallet: EmbeddedWallet;
  walletConnect: WalletConnect;
  phantom: PhantomWallet;
  walletConnectV1: WalletConnect;
  okx: OKXWallet;
  oneKey: OneKeyWallet;
  cryptoDefiWallet: CryptoDefiWallet;
  rabby: RabbyWallet;
};

/**
 * @returns the current active wallet instance
 */
export function useWallet<T extends WalletId>(
  walletId: T,
): WalletIdToWalletTypeMap[T] | undefined;
export function useWallet(): WalletInstance | undefined;
export function useWallet<T extends WalletId>(walletId?: T) {
  const context = useWalletContext();
  invariant(
    context,
    "useWallet() hook must be used within a <ThirdwebProvider/>",
  );

  const activeWallet = context.activeWallet;

  if (!activeWallet) {
    return undefined;
  }

  // if walletId is provided, return the wallet instance only if it matches the walletId
  if (walletId) {
    if (activeWallet.walletId === walletId) {
      return activeWallet as WalletIdToWalletTypeMap[T];
    } else {
      return undefined;
    }
  }

  return activeWallet;
}

/**
 * @returns the current active wallet's configuration object
 */
export function useWalletConfig() {
  const context = useWalletContext();
  invariant(
    context,
    "useWallet() hook must be used within a <ThirdwebProvider/>",
  );
  return context.activeWalletConfig;
}

/**
 *
 * @returns `supportedWallets` configured in the `<ThirdwebProvider/>`
 */
export function useWallets() {
  const context = useWalletContext();
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
  const context = useWalletContext();
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
  const context = useWalletContext();
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
  const context = useWalletContext();
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
export function useSetConnectionStatus() {
  const context = useWalletContext();
  invariant(
    context,
    "useSetConnectionStatus() must be used within a <ThirdwebProvider/>",
  );
  return context.setConnectionStatus;
}

/**
 *
 * @returns a method to create an instance of given wallet class
 */
export function useCreateWalletInstance() {
  const context = useWalletContext();
  invariant(
    context,
    "useCreateWalletInstance() must be used within a <ThirdwebProvider/>",
  );
  return context.createWalletInstance;
}

/**
 *
 * @returns a method to connect the wallet to network/chain with given chainId
 * @networkConnection
 */
export function useSwitchChain() {
  const context = useWalletContext();
  invariant(
    context,
    "useSwitchChain() must be used within a <ThirdwebProvider/>",
  );
  return context.switchChain;
}

/**
 *
 * @returns a method to set a connected wallet instance
 */
export function useSetConnectedWallet() {
  const context = useWalletContext();
  invariant(
    context,
    "useSwitchChain() must be used within a <ThirdwebProvider/>",
  );
  return context.setConnectedWallet;
}
