import { Icon } from "../../../assets/icon";
import { useAppTheme } from "../../../styles/hooks";
import Text from "../Text";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface ModalHeaderTextCloseProps {
  onClose: () => void;
  headerText: ReactNode | string;
  subHeaderText?: ReactNode | string;
}

export const ModalHeaderTextClose = ({
  headerText,
  subHeaderText,
  onClose,
}: ModalHeaderTextCloseProps) => {
  const theme = useAppTheme();

  return (
    <>
      <View style={styles.header}>
        {typeof headerText === "string" ? (
          <Text variant="header">{headerText}</Text>
        ) : (
          headerText
        )}
        <Icon
          type="close"
          size={14}
          color={theme.colors.iconSecondary}
          onPress={onClose}
        />
      </View>
      <View style={styles.subHeader}>
        {typeof subHeaderText === "string" ? (
          <Text variant="subHeader">{subHeaderText}</Text>
        ) : (
          subHeaderText
        )}
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
  subHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
