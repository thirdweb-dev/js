import Text from "../Text";
import { TouchableOpacity, StyleSheet } from "react-native";

export const ModalFooter = ({
  footer,
  onPress,
}: {
  footer: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.footer} onPress={onPress}>
      <Text variant="link">{footer}</Text>
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
