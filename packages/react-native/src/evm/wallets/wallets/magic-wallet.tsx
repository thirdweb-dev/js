import { WalletOptions, walletIds } from "@thirdweb-dev/wallets";
import {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
  useCreateWalletInstance,
} from "@thirdweb-dev/react-core";
import { TextInput } from "react-native";
import { MagicLinkOptions } from "../connectors/magic/types";
import { MagicWallet } from "./MagicWallet";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const magicWallet = (
  config: MagicLinkOptions,
): WalletConfig<MagicWallet, MagicLinkOptions> => {
  return {
    id: walletIds.magicLink,
    meta: MagicWallet.meta,
    create: (options: WalletOptions) => {
      return new MagicWallet({ ...options, ...config });
    },
    /**
     * UI for connecting wallet
     */
    connectUI: MagicConnectionUI,
    /**
     * UI for selecting wallet - this UI is rendered in the wallet selection screen
     */
    selectUI: (props: SelectUIProps<MagicWallet, MagicLinkOptions>) => {
      return (
        <TextInput
          style={{ width: 100, backgroundColor: "white", flex: 1 }}
          onEndEditing={props.onSelect}
        />
      );
    },
    isInstalled: () => {
      return true;
    },
    config: {
      ...config,
    },
  };
};

const MagicConnectionUI: React.FC<
  ConnectUIProps<MagicWallet, MagicLinkOptions>
> = (props) => {
  const createWalletInstance = useCreateWalletInstance();
  const magic = createWalletInstance(props.walletConfig).getMagicSDK();

  return (
    <SafeAreaProvider>
      <magic.Relayer />
    </SafeAreaProvider>
  );
};
