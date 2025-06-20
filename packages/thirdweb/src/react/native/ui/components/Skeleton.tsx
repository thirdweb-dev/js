import type React from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import type { Theme } from "../../../core/design-system/index.js";
import { radius } from "../../design-system/index.js";

const { width } = Dimensions.get("window");

interface SkeletonLoaderProps {
  theme: Theme;
  color?: string;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonLoaderProps> = ({
  style,
  color,
  theme,
}) => {
  const translateX = useRef(new Animated.Value(-width));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX.current, {
          duration: 2500,
          toValue: width,
          useNativeDriver: true,
        }),
        Animated.timing(translateX.current, {
          duration: 0,
          toValue: -width,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color || theme.colors.borderColor },
        style,
      ]}
    >
      <View style={styles.skeleton} />
      <Animated.View
        style={[
          styles.gradient,
          {
            transform: [{ translateX: translateX.current }],
          },
        ]}
      >
        <View style={styles.innerGradient} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  gradient: {
    bottom: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  innerGradient: {
    backgroundColor: "rgba(255,255,255,0.5)",
    height: "100%",
    opacity: 0.3,
    transform: [{ skewX: "-20deg" }],
    width: "100%",
  },
  skeleton: {
    height: "100%",
    width: "100%",
  },
});
