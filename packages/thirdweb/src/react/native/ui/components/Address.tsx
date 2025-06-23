import { useState } from "react";
import { Clipboard, StyleSheet, TouchableOpacity } from "react-native";
import type { Account } from "../../../../wallets/interfaces/wallet.js";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { CHECK, COPY_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";
import { ThemedText } from "./text.js";

type AddressProps = {
  account: Account;
  theme: Theme;
  addressOrENS: string;
};

export const Address = ({ account, theme, addressOrENS }: AddressProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        Clipboard.setString(account.address);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 2500);
      }}
      style={styles.addressContainer}
    >
      <ThemedText theme={theme} type="defaultSemiBold">
        {addressOrENS}
      </ThemedText>
      <RNImage
        color={
          copySuccess ? theme.colors.success : theme.colors.secondaryIconColor
        }
        data={copySuccess ? CHECK : COPY_ICON}
        size={15}
        theme={theme}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
