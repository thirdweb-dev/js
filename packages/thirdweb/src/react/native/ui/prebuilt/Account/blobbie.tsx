import { hexToNumber } from "@noble/curves/abstract/utils";
import { useMemo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { Defs, LinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { useAccountContext } from "../../../../core/account/provider.js";
import { COLOR_OPTIONS } from "../../../../core/utils/account.js";
/**
 * Props for the Blobbie component
 * @component
 */
export type BlobbieProps = {
  address: string;
  size: number;
  style?: ViewStyle;
};

/**
 * A wrapper for the Blobbie component
 * @param props BlobbieProps
 * @beta
 * @wallet
 */
export function AccountBlobbie(props: Omit<BlobbieProps, "address">) {
  const { address } = useAccountContext();
  return <Blobbie {...props} address={address} />;
}

/**
 * A unique gradient avatar based on the provided address.
 * @param props The component props.
 * @param props.address The address to generate the gradient with.
 * @param props.style The style for the component
 * @param props.size The size of each side of the square avatar (in pixels)
 * @component
 * @wallet
 * @example
 * ```tsx
 * import { Blobbie } from "thirdweb/react";
 *
 * <Blobbie address="0x...." style={{ width: 40, height: 40 }} />
 * ```
 */
export function Blobbie(props: BlobbieProps) {
  const colors = useMemo(
    () =>
      COLOR_OPTIONS[
        Number(hexToNumber(props.address.slice(2, 4))) % COLOR_OPTIONS.length
      ] as [string, string],
    [props.address],
  );

  const containerStyle = useMemo(() => {
    const baseStyle = props.style || {};
    if (props.size) {
      return {
        ...baseStyle,
        height: props.size,
        width: props.size,
      };
    }
    return baseStyle;
  }, [props.style, props.size]);

  const gradientUniqueId = `grad${colors[0]}+${colors[1]}`.replace(
    /[^a-zA-Z0-9 ]/g,
    "",
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Svg height="100%" style={StyleSheet.absoluteFillObject} width="100%">
        <Defs>
          <LinearGradient
            id={gradientUniqueId}
            x1="0%"
            x2="100%"
            y1="100%"
            y2="0%"
          >
            <Stop offset="0" stopColor={colors[0]} />
            <Stop offset="1" stopColor={colors[1]} />
          </LinearGradient>
        </Defs>
        <Rect fill={`url(#${gradientUniqueId})`} height="100%" width="100%" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});
