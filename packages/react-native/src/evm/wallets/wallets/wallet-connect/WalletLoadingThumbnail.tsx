import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { useAppTheme } from "../../../styles/hooks";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface Props {
  children?: React.ReactNode;
  imageSize?: number;
  showError?: boolean;
}

function WalletLoadingThumbnail({
  children,
  showError,
  imageSize = 50,
}: Props) {
  const Theme = useAppTheme();
  const spinValue = useRef(new Animated.Value(0));

  useEffect(() => {
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
  }, [spinValue]);

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -371],
  });

  return (
    <View style={styles.container}>
      <Svg
        width={imageSize + 10}
        height={imageSize + 10}
        viewBox={`0 0 ${imageSize + 10} ${imageSize + 10}`}
        style={styles.loader}
      >
        <AnimatedRect
          x="2"
          y="2"
          width={imageSize + 6}
          height={imageSize + 6}
          rx={15}
          stroke={showError ? "transparent" : Theme.colors.linkPrimary}
          strokeWidth={2}
          fill="transparent"
          strokeDasharray={"116 255"}
          strokeDashoffset={spin}
        />
      </Svg>
      {showError && (
        <View
          style={[
            {
              position: "absolute",
              borderWidth: 2,
              height: imageSize + 6,
              width: imageSize + 6,
              borderRadius: 30 / 3.5,
              borderColor: Theme.colors.border,
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
