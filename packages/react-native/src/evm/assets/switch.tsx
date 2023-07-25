import Svg, { Path } from "react-native-svg";
import { IconStyleProp } from "./types";

const SwitchIcon = ({ width, height, color }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
      <Path
        d="M7.99967 0.666626H10.6663M10.6663 0.666626V3.33329M10.6663 0.666626L7.83301 4.16663M1.33301 10.6666L3.99967 7.99996M7.99967 10.6666H10.6663M10.6663 10.6666V7.99996M10.6663 10.6666L1.33301 1.33329"
        stroke={color || "#646D7A"}
        stroke-width="1.33333"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default SwitchIcon;
