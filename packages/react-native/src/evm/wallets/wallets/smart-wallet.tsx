import {
  useAddress,
  useConnect,
  useWalletContext,
  type WalletConfig,
  type WalletOptions,
} from "@thirdweb-dev/react-core";
import { SmartWallet, createAsyncLocalStorage } from "@thirdweb-dev/wallets";
import { SmartWalletConfig } from "../types/smart-wallet";
import { SmartWalletFlow } from "../../components/ConnectWalletFlow/SmartWallet/SmartWalletFlow";

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
      return <SmartWalletFlow {...props} personalWalletConfig={wallet} />;
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
