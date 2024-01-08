import {
  ConnectUIProps,
  useAddress,
  useConnect,
  useWalletContext,
  type WalletConfig,
  type WalletOptions,
} from "@thirdweb-dev/react-core";
import { SmartWallet, createAsyncLocalStorage } from "@thirdweb-dev/wallets";
import { SmartWalletConfig } from "../types/smart-wallet";
import { SmartWalletFlow } from "../../components/ConnectWalletFlow/SmartWallet/SmartWalletFlow";

/**
 * Wallet config for Smart Wallet.
 *
 * @param wallet - The EOA wallet config to be connected to the SmartWallet
 * @param config - The config for SmartWallet
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, smartWallet, metamaskWallet } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[
 *       smartWallet(metamaskWallet(), {
 *          factoryAddress: 'factory-address',
 *          gasless: true,
 *       }),
 *    ]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const smartWallet = (
  wallet: WalletConfig<any>,
  config: SmartWalletConfig,
): WalletConfig<SmartWallet> => {
  const WalletSelectUI = wallet.selectUI;

  return {
    ...wallet,
    create: (options: WalletOptions) =>
      new SmartWallet({
        ...options,
        ...config,
        walletStorage: createAsyncLocalStorage("smart-wallet"),
      }),
    connectUI(props) {
      return <SmartConnectUI {...props} personalWalletConfig={wallet} />;
    },
    selectUI: WalletSelectUI
      ? (props) => {
          // TEMP BUILD FIX
          const connect = useConnect();
          const address = useAddress();
          const {
            setConnectedWallet,
            setConnectionStatus,
            connectionStatus,
            createWalletInstance,
            activeWallet,
          } = useWalletContext();

          return (
            <WalletSelectUI
              {...props}
              walletConfig={wallet}
              // TEMPORARY BUILD FIX
              connect={(options: any) => connect(wallet, options)}
              connectedWallet={activeWallet}
              connectedWalletAddress={address}
              connectionStatus={connectionStatus}
              createWalletInstance={() => createWalletInstance(wallet)}
              setConnectedWallet={setConnectedWallet}
              setConnectionStatus={setConnectionStatus}
            />
          );
        }
      : undefined,
    personalWallets: [wallet],
  };
};

export const SmartConnectUI = (
  props: ConnectUIProps<SmartWallet> & { personalWalletConfig: WalletConfig },
) => {
  const { walletConfig } = props;
  const { personalWalletConfig } = props;
  const { personalWalletConnection } = useWalletContext();

  return (
    <SmartWalletFlow
      {...props}
      smartWalletConfig={walletConfig}
      personalWalletConfig={personalWalletConfig}
      personalWallet={personalWalletConnection.activeWallet}
      personalWalletChainId={personalWalletConnection.chainId || 1}
    />
  );
};
