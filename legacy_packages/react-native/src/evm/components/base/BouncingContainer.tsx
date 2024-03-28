import React, { useRef, useEffect } from "react";
import { Animated, ViewProps } from "react-native";

interface BouncingContainerProps extends ViewProps {
  duration?: number;
}

const BouncingContainer: React.FC<BouncingContainerProps> = ({
  children,
  duration = 500,
  ...props
}) => {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 10,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceValue, duration]);

  return (
    <Animated.View
      {...props}
      style={[
        props.style,
        {
          transform: [{ translateY: bounceValue }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default BouncingContainer;
