import { useQuery } from "@tanstack/react-query";
import { Image, StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { nativeLocalStorage } from "../../../../utils/storage/nativeStorage.js";
import { getWalletInfo } from "../../../../wallets/__generated__/getWalletInfo.js";
import type { Account, Wallet } from "../../../../wallets/interfaces/wallet.js";
import { parseTheme } from "../../../core/design-system/CustomThemeProvider.js";
import type { ConnectButtonProps } from "../../../core/hooks/connection/ConnectButtonProps.js";
import { getLastAuthProvider } from "../../../core/utils/storage.js";
import { useConnectedWalletDetails } from "../../../core/utils/wallet.js";
import { fontSize, spacing } from "../../design-system/index.js";
import { useActiveWalletChain } from "../../hooks/wallets/useActiveWalletChain.js";
import { useDisconnect } from "../../hooks/wallets/useDisconnect.js";
import { ThemedButton } from "../components/button.js";
import { ThemedText } from "../components/text.js";
import {
  APPLE_ICON,
  EMAIL_ICON,
  FACEBOOK_ICON,
  GOOGLE_ICON,
  PHONE_ICON,
  WALLET_ICON,
} from "../icons/svgs.js";

export function ConnectedButton(
  props: ConnectButtonProps & {
    onClose: () => void;
    wallet: Wallet;
    account: Account;
  },
) {
  const theme = parseTheme(props.theme);
  const { account, wallet } = props;
  const { disconnect } = useDisconnect();
  const walletChain = useActiveWalletChain();
  const { ensAvatarQuery, addressOrENS, balanceQuery } =
    useConnectedWalletDetails(
      props.client,
      walletChain,
      account,
      props.detailsButton?.displayBalanceToken,
    );
  return (
    wallet &&
    account && (
      <ThemedButton
        theme={theme}
        onPress={() => {
          props.onClose();
          disconnect(wallet);
        }}
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.smd,
        }}
      >
        <View style={styles.row}>
          <WalletImageOrEns
            wallet={wallet}
            account={account}
            ensAvatar={ensAvatarQuery.data}
          />
          <View style={styles.col}>
            <ThemedText
              theme={theme}
              type="defaultSemiBold"
              style={{
                color: theme.colors.primaryButtonText,
                fontSize: fontSize.sm,
              }}
            >
              {addressOrENS}
            </ThemedText>
            <ThemedText
              theme={theme}
              type="subtext"
              style={{
                fontSize: fontSize.sm,
              }}
            >
              {balanceQuery.data
                ? Number(balanceQuery.data.displayValue).toFixed(3)
                : "-"}{" "}
              {balanceQuery.data?.symbol}{" "}
            </ThemedText>
          </View>
        </View>
        {/* <ThemedText
          theme={theme}
          type="defaultSemiBold"
          style={{ color: theme.colors.primaryButtonText }}
        >
          Disconnect
        </ThemedText> */}
      </ThemedButton>
    )
  );
}

const WalletImageOrEns = (props: {
  wallet: Wallet;
  account: Account;
  ensAvatar?: string | null;
}) => {
  const { wallet, account, ensAvatar } = props;
  const { data: imageData } = useQuery({
    queryKey: ["wallet-image-or-ens", wallet.id, account.address],
    queryFn: async () => {
      let imageData: string;
      let imageType: "xml" | "image" | "url";
      if (ensAvatar) {
        return {
          data: ensAvatar,
          type: "url",
        };
      }
      if (wallet.id === "inApp") {
        const lastAuthProvider = await getLastAuthProvider(nativeLocalStorage);
        imageType = "xml";
        switch (lastAuthProvider) {
          case "phone":
            imageData = PHONE_ICON;
            break;
          case "email":
            imageData = EMAIL_ICON;
            break;
          case "google":
            imageData = GOOGLE_ICON;
            break;
          case "apple":
            imageData = APPLE_ICON;
            break;
          case "facebook":
            imageData = FACEBOOK_ICON;
            break;
          default:
            imageData = WALLET_ICON;
            break;
        }
        return {
          data: imageData,
          type: imageType,
        };
      }
      const externalWalletImage = await getWalletInfo(wallet.id, true);
      return {
        data: externalWalletImage,
        type: "image",
      };
    },
  });

  if (imageData) {
    switch (imageData.type) {
      case "url":
        return (
          <Image source={{ uri: imageData.data }} width={42} height={42} />
        );
      case "image":
        return (
          <Image
            source={{ uri: imageData.data }}
            style={{ width: 42, height: 42, borderRadius: 6 }}
          />
        );
      case "xml":
        return <SvgXml xml={imageData.data} width={40} height={40} />;
    }
  }
  return null;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    gap: spacing.md,
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
    gap: spacing.xxs,
  },
});
