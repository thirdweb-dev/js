import Text from "../base/Text";
import { ChooseWallet } from "./ChooseWallet/ChooseWallet";
import { ConnectingWallet } from "./ConnectingWallet/ConnectingWallet";
import {
  WalletConfig,
  useAddress,
  useWalletContext,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useCallback, useEffect, useState } from "react";
import { walletIds } from "@thirdweb-dev/wallets";
import { useColorScheme } from "react-native";
import {
  useGlobalTheme,
  useLocale,
  useUIContext,
} from "../../providers/ui-context-provider";
import { CLOSE_MODAL_STATE } from "../../utils/modalTypes";
import Box from "../base/Box";
import { ThemeProvider } from "../../styles/ThemeProvider";
import { Theme } from "../../styles/theme";

export type ConnectEmbedProps = {
  /**
   * Set a custom title for the Connect Wallet modal
   *
   * The default is `"Choose your wallet"`
   */
  modalTitle?: string;

  /**
   * Replace the thirdweb icon next to modalTitle and set your own iconUrl
   *
   * Set to empty string to hide the icon
   */
  modalTitleIconUrl?: string;

  /**
   * theme for the ConnectEmbed
   *
   * If a theme is set on the [`ThirdWebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) component, it will be used as the default theme for all thirdweb components, else the default will be "dark"
   *
   * theme can be set to either "dark" or "light" or a custom theme object.
   *
   * You can also import `lightTheme` or `darkTheme` functions from `@thirdweb-dev/react-native` to use the default themes as base and overrides parts of it.
   *
   * @example
   * ```ts
   * import { lightTheme } from "@thirdweb-dev/react-native";
   * const customTheme = lightTheme({
   *  colors: {
   *    accentButtonTextColor: 'red'
   *  }
   * })
   * ```
   */
  theme?: "dark" | "light" | Theme;

  /**
   * If provided, Embed will show a Terms of Service message at the bottom with below link
   */
  termsOfServiceUrl?: string;

  /**
   * If provided, Embed will show a Privacy Policy message at the bottom with below link
   */
  privacyPolicyUrl?: string;

  /**
   * Callback to be called on successful connection of wallet
   *
   * ```tsx
   * <ConnectEmbed
   *  onConnect={() => {
   *    console.log("wallet connected")
   *  }}
   * />
   * ```
   *
   * Note that this does not include the sign in, If you want to call a callback after user connects AND signs in with their wallet, use `auth.onLogin` prop instead
   *
   * ```tsx
   * <ConnectEmbed
   *  auth={{
   *   onLogin: () => {
   *     console.log("wallet connected and signed in")
   *   }
   *  }}
   * />
   * ```
   *
   */
  onConnect?: () => void;

  /**
   * Props to be passed to the Embed container component to control padding, margin, etc.
   *
   * ```tsx
   * <ConnectEmbed container={{
   *       paddingVertical: 'md',
   *       marginHorizontal: 'md',
   *       borderRadius: 'md',
   *     }} />
   * ```
   */
  container?: React.ComponentProps<typeof Box>;
};

export const ConnectEmbed = (props: ConnectEmbedProps) => {
  return <ConnectEmbedUI {...props} isModal={false} />;
};

export const ConnectEmbedUI = ({
  modalTitle,
  modalTitleIconUrl,
  privacyPolicyUrl,
  termsOfServiceUrl,
  isModal = true,
  theme,
  container: container,
  onConnect,
}: ConnectEmbedProps & { isModal: boolean }) => {
  const l = useLocale();
  const supportedWallets = useWallets();
  const setModalState = useUIContext().setModalState;
  const walletConfig =
    supportedWallets.length === 1 ? supportedWallets[0] : undefined;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletConfig | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectionData, setSelectionData] = useState<any>();
  const colorTheme = useColorScheme();
  const appTheme = useGlobalTheme();
  const setTheme = useUIContext().setTheme;
  const address = useAddress();
  const {
    activeWallet: connectedWallet,
    setConnectedWallet,
    setConnectionStatus,
    connectionStatus,
    connect,
    createWalletInstance,
  } = useWalletContext();

  const onClose = useCallback(
    (reset?: boolean) => {
      setModalState(CLOSE_MODAL_STATE("ConnectWalletFlow"));

      if (reset) {
        resetModal();
      }
    },
    [setModalState],
  );

  const connectActiveWallet = useCallback(
    async (wallet: WalletConfig, data?: any) => {
      setIsConnecting(true);
      try {
        await connect(wallet, { ...data });
        onConnect?.();
      } catch (error) {
        console.error("Error connecting to the wallet", error);
      } finally {
        onClose(true);
      }
    },
    [connect, onClose, onConnect],
  );

  const onChooseWallet = useCallback(
    (wallet: WalletConfig, data?: any) => {
      setSelectionData(data);
      setActiveWallet(wallet);

      // If the wallet has no custom connect UI, then connect it
      if (!wallet.connectUI) {
        connectActiveWallet(wallet, data);
      }
    },
    [connectActiveWallet],
  );

  useEffect(() => {
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme, theme]);

  useEffect(() => {
    // case when only one wallet is passed in supportedWallets
    if (walletConfig) {
      // if there's a selection UI, then continue with the flow
      if (walletConfig.selectUI) {
        return;
      }

      if (walletConfig.connectUI) {
        // if there's a connection UI and no selection UI, then show it
        setActiveWallet(walletConfig);
        return;
      }

      // if there's no connection UI or selectionUI, then automatically select it
      onChooseWallet(walletConfig);
    }
  }, [onChooseWallet, walletConfig]);

  const onOpenModal = () => {
    setModalVisible(true);
  };

  const onBackPress = useCallback(() => {
    resetModal();
  }, []);

  const resetModal = () => {
    setActiveWallet(undefined);
    setIsConnecting(false);
  };

  const handleClose = useCallback(() => {
    onClose(true);
  }, [onClose]);

  const getComponentForWallet = useCallback(() => {
    if (activeWallet?.connectUI) {
      return (
        <activeWallet.connectUI
          modalSize="compact"
          theme={colorTheme || "dark"}
          goBack={onBackPress}
          connected={handleClose}
          isOpen={modalVisible}
          show={onOpenModal}
          hide={handleClose}
          walletConfig={activeWallet}
          supportedWallets={supportedWallets}
          selectionData={selectionData}
          setSelectionData={() => {}} // TODO
          connect={(options) => {
            return connect(activeWallet, options);
          }}
          connectedWallet={connectedWallet}
          connectedWalletAddress={address}
          connectionStatus={connectionStatus}
          createWalletInstance={() => createWalletInstance(activeWallet)}
          setConnectedWallet={setConnectedWallet}
          setConnectionStatus={setConnectionStatus}
        />
      );
    }
  }, [
    activeWallet,
    address,
    connect,
    connectedWallet,
    connectionStatus,
    createWalletInstance,
    handleClose,
    modalVisible,
    onBackPress,
    selectionData,
    setConnectedWallet,
    setConnectionStatus,
    supportedWallets,
    colorTheme,
  ]);

  return (
    <ThemeProvider theme={appTheme}>
      <Box flexDirection="column" backgroundColor="background" {...container}>
        {activeWallet ? (
          isConnecting ? (
            <ConnectingWallet
              subHeaderText=""
              content={
                activeWallet.id === walletIds.localWallet ? (
                  <Text variant="bodySmallSecondary" mt="md" textAlign="center">
                    {l.connecting_wallet.creating_encrypting}
                  </Text>
                ) : undefined
              }
              wallet={activeWallet}
              onClose={isModal ? onClose : undefined}
              onBackPress={onBackPress}
            />
          ) : (
            getComponentForWallet()
          )
        ) : (
          <ChooseWallet
            headerText={modalTitle}
            modalTitleIconUrl={modalTitleIconUrl}
            privacyPolicyUrl={privacyPolicyUrl}
            termsOfServiceUrl={termsOfServiceUrl}
            wallets={supportedWallets}
            onChooseWallet={onChooseWallet}
            onClose={isModal ? onClose : undefined}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};
