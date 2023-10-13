import React, { useCallback, useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { baseTheme } from "../../styles/theme";
import { useGlobalTheme } from "../../providers/ui-context-provider";

type LoadingTextAnimationProps = {
  text: string;
  textVariant: keyof typeof baseTheme.textVariants;
};

const LoadingTextAnimation = ({
  text,
  textVariant,
}: LoadingTextAnimationProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useGlobalTheme();

  const fadeInOut = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 },
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    fadeInOut();
  }, [fadeInOut]);

  return (
    <View style={styles.animatedView}>
      <Animated.Text
        style={{
          color: theme.colors.textSecondary,
          fontWeight: theme.textVariants[textVariant].fontWeight as any,
          fontSize: theme.textVariants[textVariant].fontSize,
          lineHeight: theme.textVariants[textVariant].lineHeight,
          opacity: fadeAnim,
        }}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default LoadingTextAnimation;

const styles = StyleSheet.create({
  animatedView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flex: 1,
  },
});
