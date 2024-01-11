import {
  WalletConfig,
  WalletOptions,
  useAddress,
  useConnect,
  useConnectionStatus,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWallet,
} from "@thirdweb-dev/react-core";
import { WalletConnect } from "./WalletConnect";
import { WalletConnectInnerUI } from "./WalletConnectUI";
import { TW_WC_PROJECT_ID } from "../../../constants/walletConnect";
import { walletIds } from "@thirdweb-dev/wallets";

export type WalletConnectConfig = {
  projectId?: string;
  recommended?: boolean;
};

/**
 * Wallet config for WalletConnect.
 *
 * @param config - The config for WalletConnect
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, walletConnect } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[walletConnect()]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const walletConnect = (
  config?: WalletConnectConfig,
): WalletConfig<WalletConnect> => {
  const projectId = config?.projectId || TW_WC_PROJECT_ID;
  return {
    id: WalletConnect.id,
    meta: WalletConnect.meta,
    create: (options: WalletOptions) =>
      new WalletConnect({
        ...options,
        walletId: walletIds.walletConnect,
        projectId,
      }),
    connectUI(props) {
      return <WalletConnectInnerUI {...props} projectId={projectId} />;
    },
    recommended: config?.recommended,
  };
};

export type WalletConnectUIProps = {
  /**
   * temporarily hide the ConnectModal
   * This is useful when you want to open another modal and do not want to show the ConnectModal in the background
   */
  hide: () => void;

  /**
   * when the wallet is connected, call this function to indicate that the wallet is connected and it is safe to close the Modal
   */
  connected: () => void;

  /**
   * go back to the wallet selector screen in connect wallet modal
   */
  goBack: () => void;

  /**
   * `WalletConfig` object of the wallet
   */
  walletConfig: WalletConfig<WalletConnect>;

  /**
   * Array of supported wallets including this wallet.
   */
  supportedWallets: WalletConfig[];

  projectId: string;

  isVisible?: boolean;
};

export const WalletConnectUI = (props: WalletConnectUIProps) => {
  const connect = useConnect();
  const connectionStatus = useConnectionStatus();
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const connectedWallet = useWallet();
  const address = useAddress();

  return (
    <WalletConnectInnerUI
      {...props}
      setConnectionStatus={setConnectionStatus}
      setConnectedWallet={setConnectedWallet}
      projectId={props.projectId}
      isVisible={props.isVisible}
      connect={(connectProps) => connect(props.walletConfig, connectProps)}
      connectionStatus={connectionStatus}
      createWalletInstance={() => createWalletInstance(props.walletConfig)}
      connectedWallet={connectedWallet as WalletConnect}
      connectedWalletAddress={address}
    />
  );
};
