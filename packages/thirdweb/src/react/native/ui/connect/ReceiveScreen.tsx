import { StyleSheet, View } from "react-native";
import type { ThirdwebClient } from "../../../../client/client.js";
import { shortenAddress } from "../../../../utils/address.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { Address } from "../components/Address.js";
import { type ContainerType, Header } from "../components/Header.js";
import { Spacer } from "../components/spacer.js";
import { ThemedText } from "../components/text.js";
import { WalletImage } from "../components/WalletImage.js";

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
        containerType={containerType}
        onBack={onBack}
        onClose={onClose}
        theme={theme}
        title="Receive Funds"
      />
      <View style={styles.container}>
        {/* TODO (rn) QR code scanning */}
        <WalletImage client={client} size={80} theme={theme} wallet={wallet} />
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
          style={{ textAlign: "center" }}
          theme={theme}
          type="subtext"
        >
          Copy your address to send funds to this wallet
        </ThemedText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    alignItems: "center",
    borderRadius: spacing.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    padding: spacing.md,
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    gap: spacing.md,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
});
