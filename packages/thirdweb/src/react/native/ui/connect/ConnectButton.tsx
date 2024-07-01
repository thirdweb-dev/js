import { useEffect, useRef, useState } from "react";
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
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { useActiveAccount } from "../../hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../hooks/wallets/useActiveWallet.js";
import { ThemedButton } from "../components/button.js";
import { ThemedText } from "../components/text.js";
import { ConnectModal } from "./ConnectModal.js";
import { ConnectedButton } from "./ConnectedButton.js";
import { ConnectedModal } from "./ConnectedModal.js";

export function ConnectButton(props: ConnectButtonProps) {
  const theme = parseTheme(props.theme);
  const [visible, setVisible] = useState(false);
  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const fadeAnim = useRef(new Animated.Value(0)).current; // For background opacity
  const slideAnim = useRef(new Animated.Value(screenHeight)).current; // For bottom sheet position

  const openModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.exp),
      }),
    ]).start(() => {
      setVisible(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(screenHeight);
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: functions not required
  useEffect(() => {
    if (visible) {
      openModal();
    } else {
      closeModal();
    }
  }, [visible]);

  return (
    <View>
      {wallet && account ? (
        <ConnectedButton
          openModal={() => setVisible(true)}
          onClose={closeModal}
          wallet={wallet}
          account={account}
          {...props}
        />
      ) : (
        <ThemedButton theme={theme} onPress={() => setVisible(true)}>
          <ThemedText
            theme={theme}
            type="defaultSemiBold"
            style={{ color: theme.colors.primaryButtonText }}
          >
            Connect Wallet
          </ThemedText>
        </ThemedButton>
      )}
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
          <Animated.View
            style={[{ flex: 1, transform: [{ translateY: slideAnim }] }]}
          >
            <Pressable style={styles.dismissArea} onPress={closeModal} />
            <View style={styles.bottomSheetContainer}>
              {wallet && account ? (
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
