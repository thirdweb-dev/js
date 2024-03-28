import { Icon } from "../../../assets/icon";
import {
  useGlobalTheme,
  useLocale,
} from "../../../providers/ui-context-provider";
import Text from "../../base/Text";
import { FlexAlignType, StyleSheet, View } from "react-native";

interface ConnectWalletHeaderProps {
  onClose?: () => void;
  onBackPress?: () => void;
  middleContent?: React.ReactNode;
  headerText?: string;
  subHeaderText?: string;
  alignHeader?: FlexAlignType;
}

export const ConnectWalletHeader = ({
  headerText,
  subHeaderText,
  alignHeader = "center",
  middleContent,
  onClose,
  onBackPress,
}: ConnectWalletHeaderProps) => {
  const l = useLocale();
  const theme = useGlobalTheme();

  subHeaderText =
    subHeaderText !== undefined
      ? subHeaderText
      : l.connecting_wallet.connecting_your_wallet;

  return (
    <>
      <View style={styles.header}>
        {onBackPress ? (
          <Icon
            type="back"
            width={14}
            height={14}
            onPress={onBackPress}
            color={theme.colors.iconPrimary}
          />
        ) : (
          <View />
        )}
        {middleContent ? middleContent : null}
        {onClose ? (
          <Icon
            type="close"
            width={14}
            height={14}
            onPress={onClose}
            color={theme.colors.iconPrimary}
          />
        ) : (
          <View />
        )}
      </View>
      <View style={{ ...styles.headerContainer, alignItems: alignHeader }}>
        {headerText ? (
          <Text variant="header" mt="md">
            {headerText}
          </Text>
        ) : null}
        {subHeaderText ? (
          <Text variant="subHeader" mt="md" textAlign="center">
            {subHeaderText}
          </Text>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});
