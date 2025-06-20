import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../design-system/index.js";
import { BACK_ICON, CLOSE_ICON } from "../icons/svgs.js";
import { RNImage } from "./RNImage.js";
import { ThemedText } from "./text.js";

export type ContainerType = "modal" | "embed";

export function Header({
  theme,
  title,
  onClose,
  onBack,
  containerType,
}: {
  theme: Theme;
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  containerType: ContainerType;
}) {
  if (containerType === "embed") {
    return onBack ? (
      <TouchableOpacity
        onPress={onBack}
        style={{
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.sm,
          paddingTop: spacing.lg,
        }}
      >
        <RNImage
          color={theme.colors.secondaryIconColor}
          data={BACK_ICON}
          size={14}
          theme={theme}
        />
        <ThemedText theme={theme} type="subtext">
          Back
        </ThemedText>
      </TouchableOpacity>
    ) : null;
  }

  return (
    <View style={styles.headerModal}>
      {onBack && (
        <TouchableOpacity onPress={onBack}>
          <RNImage
            color={theme.colors.secondaryIconColor}
            data={BACK_ICON}
            size={24}
            theme={theme}
          />
        </TouchableOpacity>
      )}
      <ThemedText theme={theme} type="title">
        {title}
      </ThemedText>
      {onClose && (
        <TouchableOpacity onPress={onClose}>
          <RNImage
            color={theme.colors.secondaryIconColor}
            data={CLOSE_ICON}
            size={24}
            theme={theme}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerModal: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
