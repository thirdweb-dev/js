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
      <ThemedSpinner color={theme.colors.accentText} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "column",
    gap: spacing.lg,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
});
