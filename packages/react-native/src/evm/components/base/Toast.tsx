import { ReactElement, useEffect, useRef } from "react";
import { Theme } from "../../styles/theme";
import Text from "./Text";
import { Animated, StyleSheet } from "react-native";
import { useGlobalTheme } from "../../providers/ui-context-provider";

export const TOAST_HEIGHT = 45;

export type ToastProps = {
  text: string;
  icon?: ReactElement;
  backgroundColor?: keyof Theme["colors"];
  translateY?: number;
};

/**
 * @internal
 */
export function Toast({
  text,
  icon,
  backgroundColor,
  translateY = TOAST_HEIGHT,
}: ToastProps) {
  const theme = useGlobalTheme();

  const translateYRef = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    Animated.timing(translateYRef, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [translateYRef]);

  return (
    <Animated.View
      style={{
        ...styles.toast,
        transform: [
          {
            translateY: translateYRef,
          },
        ],
        backgroundColor: backgroundColor
          ? backgroundColor
          : theme.colors.backgroundHighlight,
      }}
    >
      {icon}
      <Text variant="bodySmall">{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    flexDirection: "row",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1060,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: TOAST_HEIGHT,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 12,
  },
});
