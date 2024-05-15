import Svg, { Path } from "react-native-svg";
import { IconStyleProp } from "./types";
import React from "react";

const CheckIcon = ({ width, height, color }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 13" fill="none">
      <Path
        d="M17 1L6 12L1 7"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default CheckIcon;
