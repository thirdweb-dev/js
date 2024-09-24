import { StyleSheet, View } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { RNImage } from "../components/RNImage.js";
import { ThemedText } from "../components/text.js";
import { CLOSE_CIRCLE } from "../icons/svgs.js";

type ErrorViewProps = {
  theme: Theme;
  title: string;
};

export const ErrorView = (props: ErrorViewProps) => {
  const { theme, title } = props;

  return (
    <View style={styles.container}>
      <RNImage
        theme={theme}
        data={CLOSE_CIRCLE}
        size={64}
        color={theme.colors.danger}
      />
      <ThemedText
        type="defaultSemiBold"
        theme={theme}
        style={{ color: theme.colors.danger, textAlign: "center" }}
      >
        {title}
      </ThemedText>
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
