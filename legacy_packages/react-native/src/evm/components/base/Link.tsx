import { TouchableOpacity } from "react-native";
import Text from "./Text";
import { Theme } from "../../styles/theme";

type LinkProps = {
  text: string;
  variant?: keyof Theme["textVariants"];
  onPress?: () => void;
} & React.ComponentProps<typeof Text>;

/**
 * @internal
 */
export const Link = ({
  text,
  variant = "link",
  onPress,
  ...props
}: LinkProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text variant={variant} {...props}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
