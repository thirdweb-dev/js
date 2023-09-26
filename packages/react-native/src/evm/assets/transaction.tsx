import { IconStyleProp } from "./types";
import Svg, { Path } from "react-native-svg";

const TransactionIcon = ({
  width,
  height,
  color = "#646D7A",
}: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Path
        d="M11.3333 6.6665H2"
        stroke={color}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M14 4H2"
        stroke={color}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M14 9.3335H2"
        stroke={color}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M11.3333 12H2"
        stroke={color}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default TransactionIcon;
