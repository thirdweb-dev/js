import { StyleSheet, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import { shortenAddress } from "../../../../utils/address.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { Address } from "../components/Address.js";
import { type ContainerType, Header } from "../components/Header.js";
import { WalletImage } from "../components/WalletImage.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";

type ReceiveScreenProps = {
  theme: Theme;
  wallet: Wallet;
  account: Account;
  onClose?: () => void;
  onBack?: () => void;
  containerType: ContainerType;
  client: ThirdwebClient;
};

export const ReceiveScreen = (props: ReceiveScreenProps) => {
  const { wallet, account, theme, onClose, onBack, containerType, client } =
    props;

  return (
    <>
      <Header
        theme={theme}
        onClose={onClose}
        onBack={onBack}
        containerType={containerType}
        title="Receive Funds"
      />
      <View style={styles.container}>
        {/* TODO (rn) QR code scanning */}
        <WalletImage theme={theme} wallet={wallet} size={80} client={client} />
        <Spacer size="lg" />
        <View
          style={[
            styles.addressContainer,
            { borderColor: theme.colors.borderColor },
          ]}
        >
          <Address
            account={account}
            addressOrENS={shortenAddress(account?.address, 8)}
            theme={theme}
          />
        </View>
        <ThemedText
          theme={theme}
          type="subtext"
          style={{ textAlign: "center" }}
        >
          Copy your address to send funds to this wallet
        </ThemedText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    flexDirection: "column",
    gap: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  addressContainer: {
    width: "100%",
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: spacing.lg,
  },
});
