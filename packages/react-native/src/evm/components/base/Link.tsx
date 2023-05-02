import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";
import { Theme } from "../../styles/theme";

type LinkProps = {
  text: string;
  variant?: keyof Theme["textVariants"];
  onPress?: () => void;
} & (typeof Text)["arguments"];

export const Link = ({
  text,
  variant = "link",
  onPress,
  ...props
}: LinkProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text variant={variant} {...props}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
});
