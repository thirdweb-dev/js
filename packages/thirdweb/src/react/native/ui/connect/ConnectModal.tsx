import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { getDefaultWallets } from "../../../web/wallets/defaultWallets.js";
import { radius, spacing } from "../../design-system/index.js";
import { ThemedButtonWithIcon } from "../components/button.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { ThemedView } from "../components/view.js";
import { BACK_ICON, CLOSE_ICON, TW_ICON, WALLET_ICON } from "../icons/svgs.js";
import type { ModalState } from "./ConnectButton.js";
import { ExternalWalletsList } from "./ExternalWalletsList.js";
import { InAppWalletUI, OtpLogin } from "./InAppWalletUI.js";

export function ConnectModal(
  props: ConnectButtonProps & { theme: Theme; onClose: () => void },
) {
  const { theme, client } = props;
  const wallets = props.wallets || getDefaultWallets(props);
  const [modalState, setModalState] = useState<ModalState>({ screen: "base" });
  const inAppWallet = wallets.find((wallet) => wallet.id === "inApp") as
    | Wallet<"inApp">
    | undefined;
  const externalWallets = wallets.filter((wallet) => wallet.id !== "inApp");
  if (modalState.screen === "otp") {
    return (
      <ThemedView theme={theme} style={styles.modalContainer}>
        <Header
          theme={theme}
          onClose={props.onClose}
          onBack={() => setModalState({ screen: "base" })}
        />
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "column", gap: spacing.md }}>
          <OtpLogin
            auth={modalState.auth}
            wallet={modalState.wallet}
            client={client}
            setScreen={setModalState}
            theme={theme}
          />
        </View>
        <View style={{ flex: 1 }} />
        <PoweredByThirdweb theme={theme} />
      </ThemedView>
    );
  }

  if (modalState.screen === "external_wallets") {
    return (
      <ThemedView theme={theme} style={styles.modalContainer}>
        <Header
          theme={theme}
          onClose={props.onClose}
          onBack={() => setModalState({ screen: "base" })}
        />
        <Spacer size={"lg"} />
        <ExternalWalletsList
          theme={theme}
          externalWallets={externalWallets}
          client={client}
        />
        <View style={{ flex: 1 }} />
        <PoweredByThirdweb theme={theme} />
      </ThemedView>
    );
  }

  return (
    <ThemedView theme={theme} style={[styles.modalContainer]}>
      <Header theme={theme} onClose={props.onClose} />
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
  );
}

function Header({
  theme,
  onClose,
  onBack,
}: { theme: Theme; onClose: () => void; onBack?: () => void }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {onBack && (
        <TouchableOpacity onPress={onBack}>
          <SvgXml
            xml={BACK_ICON}
            width={24}
            height={24}
            color={theme.colors.secondaryIconColor}
          />
        </TouchableOpacity>
      )}
      <ThemedText theme={theme} type="title">
        Sign in
      </ThemedText>
      <TouchableOpacity onPress={onClose}>
        <SvgXml
          xml={CLOSE_ICON}
          width={24}
          height={24}
          color={theme.colors.secondaryIconColor}
        />
      </TouchableOpacity>
    </View>
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
        color={theme.colors.secondaryText}
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

const styles = StyleSheet.create({
  modalContainer: {
    height: 500,
    width: "100%",
    flexDirection: "column",
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
});
