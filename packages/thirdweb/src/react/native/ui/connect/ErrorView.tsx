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
        color={theme.colors.danger}
        data={CLOSE_CIRCLE}
        size={64}
        theme={theme}
      />
      <ThemedText
        style={{ color: theme.colors.danger, textAlign: "center" }}
        theme={theme}
        type="defaultSemiBold"
      >
        {title}
      </ThemedText>
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
