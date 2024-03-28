import { StyleSheet, View } from "react-native";

/**
 * @internal
 */
export const ActiveDot = ({
  width = 28,
  height = 28,
  color,
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <View
      style={{
        ...styles.dot,
        backgroundColor: color ? color : "#00d395",
        width: width,
        height: height,
      }}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: 50,
  },
});
