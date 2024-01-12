import {
  ConnectUIProps,
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
          const { personalWalletConnection } = useWalletContext();

          return (
            <WalletSelectUI
              walletConfig={wallet}
              connect={(options: any) => {
                return personalWalletConnection.connectWallet(wallet, options);
              }}
              createWalletInstance={() => {
                return personalWalletConnection.createWalletInstance(wallet);
              }}
              setConnectedWallet={(walletInstance) => {
                personalWalletConnection.setConnectedWallet(walletInstance);
              }}
              setConnectionStatus={(status) => {
                personalWalletConnection.setConnectionStatus(status);
              }}
              connectionStatus={personalWalletConnection.connectionStatus}
              supportedWallets={props.supportedWallets}
              theme={props.theme}
              connectedWallet={personalWalletConnection.activeWallet}
              connectedWalletAddress={personalWalletConnection.address}
              modalSize={props.modalSize}
              onSelect={props.onSelect}
            />
          );
        }
      : undefined,
    personalWallets: [wallet],
  };
};

const SmartConnectUI = (
  props: ConnectUIProps<SmartWallet> & { personalWalletConfig: WalletConfig },
) => {
  const { personalWalletConnection } = useWalletContext();

  return (
    <SmartWalletFlow
      {...props}
      personalWallet={personalWalletConnection.activeWallet}
      personalWalletChainId={personalWalletConnection.chainId || 1}
    />
  );
};
