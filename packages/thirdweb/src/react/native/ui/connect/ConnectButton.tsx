import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { getDefaultWallets } from "../../../web/wallets/defaultWallets.js";
import { radius, spacing } from "../../design-system/index.js";
import { ThemedButton } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { InAppWalletUI } from "./InAppWalletUI.js";

export function ConnectButton(props: ConnectButtonProps) {
  const theme = parseTheme(props.theme);
  const [visible, setVisible] = useState(false);

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
        toValue: screenHeight - modalHeight,
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
        easing: Easing.out(Easing.exp),
      }),
    ]).start(() => {
      setVisible(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(screenHeight);
    });
  };

  useEffect(() => {
    if (visible) {
      openModal();
    } else {
      closeModal();
    }
  }, [visible, openModal, closeModal]);

  return (
    <View>
      <ThemedButton theme={theme} onPress={() => setVisible(true)}>
        <ThemedText
          theme={theme}
          type="defaultSemiBold"
          style={{ color: theme.colors.primaryButtonText }}
        >
          Connect Wallet
        </ThemedText>
      </ThemedButton>
      <Modal
        visible={visible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.dismissArea} onPress={closeModal} />
        </Animated.View>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ConnectModal {...props} theme={theme} onClose={closeModal} />
        </Animated.View>
      </Modal>
    </View>
  );
}

function ConnectModal(
  props: ConnectButtonProps & { theme: Theme; onClose: () => void },
) {
  const theme = props.theme;
  const wallets = props.wallets || getDefaultWallets(props);
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp") as
    | Wallet<"inApp">
    | undefined;
  const externalWallets = wallets.filter((wallet) => wallet.id !== "inApp");
  return (
    <ThemedView theme={theme} style={styles.modalContainer}>
      <ThemedText theme={theme} type="title">
        Sign in
      </ThemedText>
      <Spacer size={"lg"} />
      <View style={{ flexDirection: "column", gap: spacing.md }}>
        {inAppWallet && <InAppWalletUI wallet={inAppWallet} {...props} />}
        {externalWallets.map((wallet) => (
          <ThemedButton
            key={wallet.id}
            theme={theme}
            variant="secondary"
            onPress={() => {
              props.onClose();
            }}
          >
            <ThemedText
              theme={theme}
              style={{ color: theme.colors.primaryText }}
            >
              {wallet.id}
            </ThemedText>
          </ThemedButton>
        ))}
        <ThemedButton theme={theme} onPress={props.onClose}>
          <ThemedText
            theme={theme}
            style={{ color: theme.colors.primaryButtonText }}
          >
            Close
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedView>
  );
}

const screenHeight = Dimensions.get("window").height;
const modalHeight = screenHeight * 0.6;
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalOverlay: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  dismissArea: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottomSheetContainer: {
    position: "absolute",
    height: modalHeight,
    width: screenWidth,
    top: 0,
    flexDirection: "column",
  },
});
