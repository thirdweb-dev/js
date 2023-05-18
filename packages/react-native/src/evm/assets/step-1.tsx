import { IconStyleProp } from "./types";
import Svg, { Circle, Path } from "react-native-svg";

const Step1Image = ({ width, height }: IconStyleProp) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 189 24" fill="none">
      <Path
        d="M22 12C22 10.8954 22.8954 10 24 10H165C166.105 10 167 10.8954 167 12C167 13.1046 166.105 14 165 14H24C22.8954 14 22 13.1046 22 12Z"
        fill="#2B3036"
      />
      <Circle cx="177" cy="12" r="11" stroke="#2B3036" stroke-width="2" />
      <Circle cx="177" cy="12" r="7" fill="#2B3036" />
      <Circle cx="12" cy="12" r="11" stroke="#3385FF" stroke-width="2" />
      <Circle cx="12" cy="12" r="7" fill="#3385FF" />
    </Svg>
  );
};

export default Step1Image;
