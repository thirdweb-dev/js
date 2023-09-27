import { StyleSheet, View } from "react-native";

export const ActiveDot = ({
  width = 28,
  height = 28,
}: {
  width?: number;
  height?: number;
}) => {
  return <View style={{ ...styles.dot, width: width, height: height }} />;
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: 50,
    backgroundColor: "#00d395",
  },
});
