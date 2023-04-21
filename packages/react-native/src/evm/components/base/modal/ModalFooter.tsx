import { useTheme } from "@shopify/restyle";
import Text from "../Text";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export const ModalFooter = ({
  footer,
  isLoading,
  onPress,
}: {
  footer: string;
  isLoading?: boolean;
  onPress?: () => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.footer} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.linkPrimary} />
      ) : (
        <Text variant="link">{footer}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 24,
    marginBottom: 14,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
