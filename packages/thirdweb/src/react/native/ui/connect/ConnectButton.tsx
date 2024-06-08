import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import type { MultiStepAuthProviderType } from "../../../../wallets/in-app/core/authentication/type.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import {
  useActiveWallet,
  useDisconnect,
} from "../../../core/hooks/wallets/wallet-hooks.js";
import { getDefaultWallets } from "../../../web/wallets/defaultWallets.js";
import { radius, spacing } from "../../design-system/index.js";
import { ThemedButton, ThemedButtonWithIcon } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { TW_ICON, WALLET_ICON } from "../icons/svgs.js";
import { ExternalWalletsUI } from "./ExternalWalletsUI.js";
import { InAppWalletUI, OtpLogin } from "./InAppWalletUI.js";

export type ModalState =
  | { screen: "base" }
  | { screen: "otp"; auth: MultiStepAuthProviderType; wallet: Wallet<"inApp"> }
  | { screen: "external_wallets" };

export function ConnectButton(props: ConnectButtonProps) {
  const theme = parseTheme(props.theme);
  const [visible, setVisible] = useState(false);
  const wallet = useActiveWallet();

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

  return wallet ? (
    <ConnectedButton onClose={closeModal} {...props} />
  ) : (
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

function ConnectedButton(props: ConnectButtonProps & { onClose: () => void }) {
  const theme = parseTheme(props.theme);
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  return (
    wallet && (
      <ThemedButton
        theme={theme}
        onPress={() => {
          props.onClose();
          disconnect(wallet);
        }}
      >
        <ThemedText
          theme={theme}
          type="defaultSemiBold"
          style={{ color: theme.colors.primaryButtonText }}
        >
          Disconnect
        </ThemedText>
      </ThemedButton>
    )
  );
}

function ConnectModal(
  props: ConnectButtonProps & { theme: Theme; onClose: () => void },
) {
  const { theme, client } = props;
  const wallets = props.wallets || getDefaultWallets(props);
  const [modalState, setModalState] = useState<ModalState>({ screen: "base" });
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp") as
    | Wallet<"inApp">
    | undefined;
  const externalWallets = wallets.filter((wallet) => wallet.id !== "inApp");

  const translateY = new Animated.Value(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const { height } = e.endCoordinates;
        Animated.timing(translateY, {
          toValue: -height,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }).start();
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }).start();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [translateY]);

  if (modalState.screen === "otp") {
    return (
      <Animated.View
        style={[{ flex: 1, width: "100%", transform: [{ translateY }] }]}
      >
        <ThemedView theme={theme} style={styles.modalContainer}>
          <ThemedText theme={theme} type="title">
            Sign in
          </ThemedText>
          <Spacer size={"lg"} />
          <View style={{ flexDirection: "column", gap: spacing.md }}>
            <OtpLogin
              auth={modalState.auth}
              wallet={modalState.wallet}
              client={client}
              setScreen={setModalState}
              theme={theme}
            />
            <ThemedButton
              theme={theme}
              onPress={() => setModalState({ screen: "base" })}
            >
              <ThemedText
                theme={theme}
                style={{ color: theme.colors.primaryButtonText }}
              >
                Back
              </ThemedText>
            </ThemedButton>
          </View>
        </ThemedView>
      </Animated.View>
    );
  }

  if (modalState.screen === "external_wallets") {
    return (
      <Animated.View
        style={[{ flex: 1, width: "100%", transform: [{ translateY }] }]}
      >
        <ThemedView theme={theme} style={styles.modalContainer}>
          <ThemedText theme={theme} type="title">
            Sign in
          </ThemedText>
          <Spacer size={"lg"} />
          <ExternalWalletsUI
            theme={theme}
            externalWallets={externalWallets}
            client={client}
          />
          <View style={{ flex: 1 }} />
          <ThemedButton
            theme={theme}
            onPress={() => setModalState({ screen: "base" })}
          >
            <ThemedText
              theme={theme}
              style={{ color: theme.colors.primaryButtonText }}
            >
              Back
            </ThemedText>
          </ThemedButton>
        </ThemedView>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[{ flex: 1, width: "100%", transform: [{ translateY }] }]}
    >
      <ThemedView theme={theme} style={styles.modalContainer}>
        <ThemedText theme={theme} type="title">
          Sign in
        </ThemedText>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "column", gap: spacing.md }}>
          {inAppWallet && (
            <InAppWalletUI
              wallet={inAppWallet}
              setScreen={setModalState}
              {...props}
            />
          )}
          <OrDivider theme={theme} />
          <ThemedButtonWithIcon
            theme={theme}
            icon={WALLET_ICON}
            title="Connect a wallet"
            onPress={() => setModalState({ screen: "external_wallets" })}
          />
        </View>
        <View style={{ flex: 1 }} />
        <PoweredByThirdweb theme={theme} />
      </ThemedView>
    </Animated.View>
  );
}

function OrDivider({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.borderColor,
        }}
      />
      <ThemedText theme={theme} style={{ color: theme.colors.secondaryText }}>
        OR
      </ThemedText>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: theme.colors.borderColor,
        }}
      />
    </View>
  );
}

function PoweredByThirdweb({ theme }: { theme: Theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.xs,
      }}
    >
      <ThemedText
        theme={theme}
        type="default"
        style={{ color: theme.colors.secondaryText }}
      >
        Powered by
      </ThemedText>
      <SvgXml
        xml={TW_ICON}
        width={22}
        height={22}
        style={{ marginBottom: -2 }}
      />
      <ThemedText
        theme={theme}
        type="defaultSemiBold"
        style={{ color: theme.colors.secondaryText }}
      >
        thirdweb
      </ThemedText>
    </View>
  );
}

const screenHeight = Dimensions.get("window").height;
const modalHeight = 480;
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
