import { useCallback, useRef, useState } from "react";
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
import { cacheChains } from "../../../../chains/utils.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { useSiweAuth } from "../../../core/hooks/auth/useSiweAuth.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { useActiveWalletConnectionStatus } from "../../hooks/wallets/useActiveWalletConnectionStatus.js";
import { useAutoConnect } from "../../hooks/wallets/useAutoConnect.js";
import { ThemedButton } from "../components/button.js";
import { ThemedSpinner } from "../components/spinner.js";
import { ThemedText } from "../components/text.js";
import { ConnectModal } from "./ConnectModal.js";
import { ConnectedButton } from "./ConnectedButton.js";
import { ConnectedModal } from "./ConnectedModal.js";

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
  const siweAuth = useSiweAuth(wallet, props.auth);
  useAutoConnect(props);

  const fadeAnim = useRef(new Animated.Value(0)); // For background opacity
  const slideAnim = useRef(new Animated.Value(screenHeight)); // For bottom sheet position

  const openModal = useCallback(() => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, []);

  // to update cached chains ASAP, we skip using useEffect - this does not trigger a re-render so it's fine
  if (props.chains) {
    cacheChains(props.chains);
  }

  if (props.chain) {
    cacheChains([props.chain]);
  }

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim.current, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.exp),
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
          openModal={() => openModal()}
          onClose={closeModal}
          wallet={wallet}
          account={account}
          {...props}
        />
      ) : (
        <ThemedButton theme={theme} onPress={() => openModal()}>
          {status === "connecting" ||
          siweAuth.isLoggingIn ||
          siweAuth.isLoading ||
          siweAuth.isLoggingOut ? (
            <>
              <ThemedSpinner color={theme.colors.primaryButtonText} />
            </>
          ) : (
            <ThemedText
              theme={theme}
              type="defaultSemiBold"
              style={{ color: theme.colors.primaryButtonText }}
            >
              {isConnectedAndNotAuth
                ? props.signInButton?.label || "Sign In"
                : props.connectButton?.label || "Connect Wallet"}
            </ThemedText>
          )}
        </ThemedButton>
      )}
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <Animated.View
            style={[styles.modalOverlay, { opacity: fadeAnim.current }]}
          />
          <Animated.View
            style={[
              { flex: 1, transform: [{ translateY: slideAnim.current }] },
            ]}
          >
            <Pressable style={styles.dismissArea} onPress={closeModal} />
            <View style={styles.bottomSheetContainer}>
              {isConnectedAndAuth ? (
                <ConnectedModal
                  {...props}
                  theme={theme}
                  onClose={closeModal}
                  containerType="modal"
                  wallet={wallet}
                  account={account}
                />
              ) : (
                <ConnectModal
                  {...props}
                  theme={theme}
                  onClose={closeModal}
                  containerType="modal"
                  siweAuth={siweAuth}
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
const modalHeight = 480;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  dismissArea: {
    width: "100%",
    flex: 1,
  },
  bottomSheetContainer: {
    height: modalHeight,
    width: screenWidth,
    flexDirection: "column",
  },
});
