import BackIcon from "./back";
import CloseIcon from "./close";
import DisconnectIcon from "./disconnect";
import DownArrowIcon from "./down-arrow";
import RightArrowIcon from "./right-arrow";
import { IconStyleProp } from "./types";
import { StyleSheet, TouchableOpacity } from "react-native";

type IconProps = {
  type: "back" | "close" | "disconnect" | "down-arrow" | "right-arrow";
  onPress?: () => void;
} & IconStyleProp;

export const Icon = (props: IconProps) => {
  const { type, onPress, ...rest } = props;

  const getIcon = () => {
    switch (type) {
      case "back":
        return <BackIcon {...rest} />;
      case "close":
        return <CloseIcon {...rest} />;
      case "disconnect":
        return <DisconnectIcon {...rest} />;
      case "down-arrow":
        return <DownArrowIcon {...rest} />;
      case "right-arrow":
        return <RightArrowIcon {...rest} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={styles.closeContainer}
      onPress={onPress}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      {getIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
