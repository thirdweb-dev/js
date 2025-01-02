import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Rect, Svg } from "react-native-svg";
import type { Theme } from "../../../core/design-system/index.js";
import { radius } from "../../design-system/index.js";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const PADDING = 10;
const INTERNAL_PADDING = 5;

interface Props {
  theme: Theme;
  children?: React.ReactNode;
  imageSize: number;
  showError?: boolean;
  animate: boolean;
  roundLoader?: boolean;
}

function WalletLoadingThumbnail({
  theme,
  children,
  showError,
  imageSize,
  animate,
  roundLoader,
}: Props) {
  const spinValue = useRef(new Animated.Value(0));

  useEffect(() => {
    if (!animate) return;
    const animation = Animated.timing(spinValue.current, {
      toValue: 1,
      duration: 1150,
      useNativeDriver: true,
      easing: Easing.linear,
    });

    const loop = Animated.loop(animation);
    loop.start();

    return () => {
      loop.stop();
    };
  }, [animate]);

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -400],
  });

  const rx = roundLoader ? imageSize / 2 : 15;

  return (
    <View style={styles.container}>
      <Svg
        width={imageSize + PADDING}
        height={imageSize + PADDING}
        viewBox={`0 0 ${imageSize + PADDING} ${imageSize + PADDING}`}
        style={styles.loader}
      >
        {animate && (
          <AnimatedRect
            x="2"
            y="2"
            width={imageSize + INTERNAL_PADDING}
            height={imageSize + INTERNAL_PADDING}
            rx={rx}
            stroke={showError ? "transparent" : theme.colors.accentText}
            strokeWidth={3}
            fill="transparent"
            strokeDasharray="100 300"
            strokeDashoffset={spin}
          />
        )}
      </Svg>
      {showError && (
        <View
          style={[
            {
              position: "absolute",
              borderWidth: 3,
              height: imageSize + INTERNAL_PADDING,
              width: imageSize + INTERNAL_PADDING,
              borderRadius: radius.lg,
              borderColor: theme.colors.borderColor,
            },
          ]}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
  },
});

export default WalletLoadingThumbnail;
