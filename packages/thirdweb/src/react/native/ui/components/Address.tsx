import Clipboard from "@react-native-clipboard/clipboard";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { CHECK, COPY_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";
import { ThemedText } from "./text.js";

export type AddressProps = {
  account: Account;
  theme: Theme;
  addressOrENS: string;
};

export const Address = ({ account, theme, addressOrENS }: AddressProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  return (
    <TouchableOpacity
      style={styles.addressContainer}
      onPress={() => {
        // @ts-ignore - missing native types
        Clipboard.setString(account.address);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2500);
      }}
    >
      <ThemedText theme={theme} type="defaultSemiBold">
        {addressOrENS}
      </ThemedText>
      <RNImage
        theme={theme}
        data={copySuccess ? CHECK : COPY_ICON}
        size={15}
        color={
          copySuccess ? theme.colors.success : theme.colors.secondaryIconColor
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
});
