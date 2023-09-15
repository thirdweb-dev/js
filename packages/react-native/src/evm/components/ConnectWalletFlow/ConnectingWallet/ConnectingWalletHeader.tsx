import { Icon } from "../../../assets/icon";
import { useAppTheme } from "../../../styles/hooks";
import ImageSvgUri from "../../base/ImageSvgUri";
import Text from "../../base/Text";
import { FlexAlignType, StyleSheet, View } from "react-native";

interface ConnectWalletHeaderProps {
  onClose: () => void;
  onBackPress?: () => void;
  walletLogoUrl?: string;
  headerText?: string;
  subHeaderText?: string;
  alignHeader?: FlexAlignType;
}

export const ConnectWalletHeader = ({
  headerText,
  subHeaderText = "Connecting your wallet",
  alignHeader = "center",
  walletLogoUrl,
  onClose,
  onBackPress,
}: ConnectWalletHeaderProps) => {
  const theme = useAppTheme();
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
        ) : null}
        {walletLogoUrl ? (
          <ImageSvgUri width={56} height={56} imageUrl={walletLogoUrl} />
        ) : null}
        <Icon
          type="close"
          width={14}
          height={14}
          onPress={onClose}
          color={theme.colors.iconPrimary}
        />
      </View>
      <View style={{ ...styles.headerContainer, alignItems: alignHeader }}>
        {headerText ? (
          <Text variant="header" mt="md">
            {headerText}
          </Text>
        ) : null}
        {subHeaderText ? (
          <Text variant="subHeader" mt="md">
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
