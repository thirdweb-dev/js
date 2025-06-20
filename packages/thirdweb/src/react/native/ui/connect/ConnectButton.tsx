import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletConnectionStatus } from "../../../core/hooks/wallets/useActiveWalletConnectionStatus.js";
import { useConnectionManager } from "../../../core/providers/connection-manager.js";
import { useAutoConnect } from "../../hooks/wallets/useAutoConnect.js";
import { ThemedButton } from "../components/button.js";
import { ThemedSpinner } from "../components/spinner.js";
import { ThemedText } from "../components/text.js";
import { ConnectedButton } from "./ConnectedButton.js";
import { ConnectedModal } from "./ConnectedModal.js";
import { ConnectModal } from "./ConnectModal.js";

/**
 * A component that allows the user to connect their wallet.
 * It renders a button which when clicked opens a modal to allow users to connect to wallets specified in `wallets` prop.
 * @example
 * ```tsx
 * <ConnectButton
 *    client={client}
 * />
 * ```
 * @param props
 * Props for the `ConnectButton` component
 *
 * Refer to [ConnectButtonProps](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps) to see the available props.
 * @component
 */
export function ConnectButton(props: ConnectButtonProps) {
  const theme = parseTheme(props.theme);
  const [visible, setVisible] = useState(false);
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const status = useActiveWalletConnectionStatus();
  const connectionManager = useConnectionManager();
  const siweAuth = useSiweAuth(wallet, account, props.auth);
  useAutoConnect({
    ...props,
    siweAuth: siweAuth,
  });

  const fadeAnim = useRef(new Animated.Value(0)); // For background opacity
  const slideAnim = useRef(new Animated.Value(screenHeight)); // For bottom sheet position

  const openModal = useCallback(() => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim.current, {
        duration: 300,
        easing: Easing.out(Easing.exp),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Add props.chain and props.chains to defined chains store
  useEffect(() => {
    if (props.chain) {
      connectionManager.defineChains([props.chain]);
    }
  }, [props.chain, connectionManager]);

  useEffect(() => {
    if (props.chains) {
      connectionManager.defineChains(props.chains);
    }
  }, [props.chains, connectionManager]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim.current, {
        duration: 300,
        easing: Easing.in(Easing.exp),
        toValue: screenHeight,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      fadeAnim.current.setValue(0);
      slideAnim.current.setValue(screenHeight);
    });
  }, []);
  const needsAuth = siweAuth.requiresAuth && !siweAuth.isLoggedIn;
  const isConnected = wallet && account;
  const isConnectedAndNotAuth = isConnected && needsAuth;
  const isConnectedAndAuth = isConnected && !needsAuth;

  return (
    <View>
      {isConnectedAndAuth ? (
        <ConnectedButton
          account={account}
          onClose={closeModal}
          openModal={() => openModal()}
          wallet={wallet}
          {...props}
        />
      ) : (
        <ThemedButton onPress={() => openModal()} theme={theme}>
          {status === "connecting" ||
          siweAuth.isLoggingIn ||
          siweAuth.isLoading ||
          siweAuth.isLoggingOut ? (
            <ThemedSpinner color={theme.colors.primaryButtonText} />
          ) : (
            <ThemedText
              style={{ color: theme.colors.primaryButtonText }}
              theme={theme}
              type="defaultSemiBold"
            >
              {isConnectedAndNotAuth
                ? props.signInButton?.label || "Sign In"
                : props.connectButton?.label || "Connect Wallet"}
            </ThemedText>
          )}
        </ThemedButton>
      )}
      <Modal
        animationType="none"
        onRequestClose={closeModal}
        transparent={true}
        visible={visible}
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <Animated.View
            style={[styles.modalOverlay, { opacity: fadeAnim.current }]}
          />
          <Animated.View
            style={[
              { flex: 1, transform: [{ translateY: slideAnim.current }] },
            ]}
          >
            <Pressable onPress={closeModal} style={styles.dismissArea} />
            <View style={styles.bottomSheetContainer}>
              {isConnectedAndAuth ? (
                <ConnectedModal
                  {...props}
                  account={account}
                  containerType="modal"
                  onClose={closeModal}
                  theme={theme}
                  wallet={wallet}
                />
              ) : (
                <ConnectModal
                  {...props}
                  containerType="modal"
                  onClose={closeModal}
                  siweAuth={siweAuth}
                  theme={theme}
                />
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const modalHeight = 520;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flexDirection: "column",
    height: modalHeight,
    width: screenWidth,
  },
  dismissArea: {
    flex: 1,
    width: "100%",
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.8)",
    height: screenHeight,
    position: "absolute",
    width: screenWidth,
  },
});
