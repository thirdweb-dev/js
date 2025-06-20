import { StyleSheet, View } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { RNImage } from "../components/RNImage.js";
import { ThemedText } from "../components/text.js";
import { CHECK_CIRCLE } from "../icons/svgs.js";

type SuccessViewProps = {
  theme: Theme;
  title: string;
};

export const SuccessView = (props: SuccessViewProps) => {
  const { theme, title } = props;

  return (
    <View style={styles.container}>
      <RNImage
        color={theme.colors.success}
        data={CHECK_CIRCLE}
        size={64}
        theme={theme}
      />
      <ThemedText
        style={{ color: theme.colors.success, textAlign: "center" }}
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
