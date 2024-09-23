import { StyleSheet, View } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { ThemedSpinner } from "../components/spinner.js";

type LoadingViewProps = {
  theme: Theme;
};

export const LoadingView = (props: LoadingViewProps) => {
  const { theme } = props;

  return (
    <View style={styles.container}>
      <ThemedSpinner size="large" color={theme.colors.accentText} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
  },
});
