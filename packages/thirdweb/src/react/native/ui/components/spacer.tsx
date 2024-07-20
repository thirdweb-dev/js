import { View } from "react-native";
import { spacing } from "../../design-system/index.js";

export function Spacer({ size }: { size: keyof typeof spacing }) {
  return <View style={{ height: spacing[size] }} />;
}
