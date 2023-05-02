import { TouchableOpacity } from "react-native";
import Text from "./Text";

export const Link = ({
  text,
  onPress,
}: {
  text: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text variant="link">{text}</Text>
    </TouchableOpacity>
  );
};
